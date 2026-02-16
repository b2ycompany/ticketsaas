import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Mapeamento universal de campos (Normalização)
    // Aceita múltiplos formatos de entrada para ser compatível com qualquer ferramenta
    const ticketData = {
      title: body.trigger_name || body.alert_title || body.subject || "Alerta de Monitoramento",
      description: body.message || body.description || "Sem descrição detalhada fornecida.",
      priority: body.severity === "5" || body.priority === "high" ? "critical" : "medium",
      status: "open",
      customerName: body.customer_name || "Sistema Automático",
      tenantId: body.tenant_id || "default_tenant",
      source: body.source_platform || "API Gateway",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      // Define SLA de 2 horas para alertas críticos via API
      slaDeadline: new Date(Date.now() + 2 * 60 * 60 * 1000)
    };

    const docRef = await addDoc(collection(db, "tickets"), ticketData);

    return NextResponse.json({ 
      success: true, 
      message: "Ticket gerado com sucesso", 
      id: docRef.id 
    }, { status: 201 });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Falha ao processar integração" 
    }, { status: 500 });
  }
}   