import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Ticket } from '../types/ticket';

/**
 * Serviço responsável pela criação de tickets e lógica de negócio.
 * Preparado para expansão: Jira, ServiceNow e Zabbix.
 */
export const createTicket = async (ticketData: Partial<Ticket>) => {
  const now = new Date();
  
  // Lógica de SLA baseada em boas práticas de mercado (ITIL)
  // Crítico: 2h | Médio/Baixo: 24h
  let slaHours = 24;
  if (ticketData.priority === 'critical') {
    slaHours = 2;
  } else if (ticketData.priority === 'high') {
    slaHours = 4;
  }

  const deadline = new Date(now.getTime() + slaHours * 60 * 60 * 1000);

  const finalTicket = {
    title: ticketData.title || "Ticket sem título",
    description: ticketData.description || "Sem descrição detalhada",
    priority: ticketData.priority || "medium",
    status: 'open',
    source: ticketData.source || 'manual',
    tenantId: ticketData.tenantId || 'default_tenant',
    customerName: ticketData.customerName || 'Cliente Geral',
    createdAt: serverTimestamp(),
    slaDeadline: Timestamp.fromDate(deadline),
  };

  try {
    const docRef = await addDoc(collection(db, "tickets"), finalTicket);
    
    // Placeholder para Integrações Futuras (ServiceNow / Jira)
    // Aqui dispararemos os Webhooks de saída na fase de implantação.
    console.log(`[LOG] Ticket ${docRef.id} criado. Pronto para sync externo.`);
    
    return docRef.id;
  } catch (e) {
    console.error("Erro crítico ao salvar no Firebase:", e);
    throw e;
  }
};

/**
 * Função para atualizar status (Fluxo de Help Desk)
 */
export const updateTicketStatus = async (ticketId: string, newStatus: string) => {
  // Futura implementação de atualização no Firestore
  console.log(`Atualizando ticket ${ticketId} para ${newStatus}`);
};