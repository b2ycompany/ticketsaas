import { Ticket } from "@/types/ticket";
import { Vendor } from "@/types/vendor";
import { Timestamp } from "firebase/firestore";

/**
 * B2Y NOTIFICATION ENGINE - SLA MONITORING V2.0
 * Resolve conflitos de tipagem entre Firestore Timestamp e Native Date.
 */
export const checkSLAStatusAndNotify = async (ticket: Ticket, vendor: Vendor) => {
  const now = new Date().getTime();
  
  // Resolução de tipo estrita para evitar erro de .toDate()
  const createdAtDate = ticket.createdAt instanceof Timestamp 
    ? ticket.createdAt.toDate() 
    : (ticket.createdAt as Date);
    
  const createdAtMs = createdAtDate.getTime();
  
  // Localiza a regra de SLA específica para a prioridade do ticket na matriz do fornecedor
  const slaRule = vendor.slas.find(s => s.priority === ticket.priority);
  if (!slaRule) return;

  const resolutionTimeMs = slaRule.resolutionTime * 60 * 1000;
  const percentUsed = ((now - createdAtMs) / resolutionTimeMs) * 100;

  // --- PROTOCOLO DE ESCALAÇÃO AUTOMÁTICA ---
  if (percentUsed >= 100) {
    await sendExternalAlert(ticket, vendor, "CRITICAL: SLA VIOLATION DETECTED");
  } else if (percentUsed >= 80) {
    await sendExternalAlert(ticket, vendor, "WARNING: SLA AT 80% CAPACITY");
  }
};

/**
 * DISPARO DE WEBHOOK EXTERNO
 * Integração com APIs de Mensageria (WhatsApp/Slack/Teams).
 */
const sendExternalAlert = async (ticket: Ticket, vendor: Vendor, alertType: string) => {
  const WEBHOOK_URL = "SUA_URL_DE_WEBHOOK_AQUI";

  const payload = {
    metadata: {
      system: "B2Y_MASTER_ITSM",
      version: "2.5",
      environment: "production"
    },
    incident: {
      id: ticket.id,
      title: ticket.title,
      priority: ticket.priority,
      status: ticket.status,
      customer: ticket.customerName
    },
    vendor: {
      name: vendor.name,
      sla_tier: vendor.active ? "GOLD" : "STANDARD",
      alert: alertType
    },
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log(`B2Y Ledger: Notificação enviada para ${vendor.name} - [${alertType}]`);
    }
  } catch (error) {
    console.error("Falha na comunicação com o gateway de notificações:", error);
  }
};