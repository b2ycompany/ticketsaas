import { Timestamp } from "firebase/firestore";

/**
 * CONTRATO DE DADOS TICKETMASTER ENTERPRISE
 * Define a estrutura de governança imutável para auditoria e SLA.
 */
export interface AuditEvent {
  event: string;
  timestamp: string;
  note: string;
  operator: string;
}

export interface Ticket {
  id?: string;
  title: string;
  description: string;
  
  // Estados Operacionais ITSM Benchmark
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'cancelled' | 'deleted';
  
  // Matriz de Criticidade
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  customerName: string;
  tenantId: string;
  source: string; 
  
  // Timestamps com tipagem rigorosa (Sem explicit any)
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  slaDeadline: Timestamp | Date;
  resolvedAt?: Timestamp | Date | null;
  deletedAt?: Timestamp | Date | null;
  
  // Governança RCA (Root Cause Analysis)
  rca?: string; 
  
  // Ledger de Auditoria (Histórico imutável)
  auditTrail?: AuditEvent[];
}