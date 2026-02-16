import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

/**
 * B2Y MASTER WEBHOOK GATEWAY
 * Recebe incidentes de plataformas externas e processa via Workflow Architect.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider, token, payload } = body;

    // 1. Validação de Autenticação do Conector
    const integrationsRef = collection(db, "integrations");
    const q = query(integrationsRef, where("provider", "==", provider), where("apiKey", "==", token));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ error: "Unauthorized Connector" }, { status: 401 });
    }

    const integrationConfig = querySnapshot.docs[0].data();
    const integrationId = querySnapshot.docs[0].id;

    // 2. Mapeamento de Payload (Engenharia Reversa Jira/Zabbix)
    const ticketData = {
      title: payload.summary || payload.trigger_name || "Incidente Externo Automatizado",
      description: payload.description || payload.trigger_description || "Sem descrição detalhada.",
      customerName: provider.toUpperCase() + "_SYSTEM",
      priority: mapPriority(payload.priority || payload.severity),
      status: integrationConfig.targetQueue, // Injeta na fila configurada pelo admin
      source: provider.toUpperCase(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      externalId: payload.key || payload.eventid || "EXT-" + Date.now(),
      auditTrail: [{
        event: "EXTERNAL_INGESTION",
        timestamp: new Date().toISOString(),
        note: `Ticket gerado via Integração ${provider}`,
        operator: "B2Y_API_GATEWAY"
      }]
    };

    // 3. Persistência no Ledger de Incidentes
    const docRef = await addDoc(collection(db, "tickets"), ticketData);

    // 4. Atualização de LastSync no Conector
    await updateDoc(doc(db, "integrations", integrationId), {
      lastSync: serverTimestamp()
    });

    return NextResponse.json({ 
      success: true, 
      id: docRef.id, 
      queue: integrationConfig.targetQueue 
    });

  } catch (error) {
    console.error("Critical Webhook Failure:", error);
    return NextResponse.json({ error: "Internal Processing Error" }, { status: 500 });
  }
}

/**
 * NORMALIZADOR DE PRIORIDADE ITSM
 */
function mapPriority(externalPriority: string): string {
  const p = String(externalPriority).toLowerCase();
  if (p.includes("crit") || p.includes("1") || p.includes("high")) return "critical";
  if (p.includes("med") || p.includes("2")) return "medium";
  return "low";
}