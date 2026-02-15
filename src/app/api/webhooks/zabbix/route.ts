import { NextResponse } from 'next/server';
import { createTicket } from '@/services/ticketService';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const ticketId = await createTicket({
      title: data.trigger_name ? `[ALERTA] ${data.trigger_name}` : "Alerta Externo",
      description: `Dispositivo: ${data.host || 'N/A'}\nMensagem: ${data.message || 'Sem detalhes'}`,
      priority: data.severity === '5' ? 'critical' : 'medium',
      tenantId: data.tenant_id || 'prod_001',
      customerName: data.customer_name || 'Monitorização Automática',
      source: 'zabbix'
    });

    return NextResponse.json({ 
      success: true, 
      id: ticketId 
    }, { status: 201 });

  } catch (err: unknown) {
    const error = err as Error; // Substituição do 'any' para satisfazer o ESLint
    console.error("Falha no Webhook:", error.message);
    return NextResponse.json({ 
      success: false, 
      error: "Erro interno no processamento" 
    }, { status: 500 });
  }
}