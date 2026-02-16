import { Timestamp } from "firebase/firestore";

export interface Ticket {
  id?: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  customerName: string;
  tenantId: string;
  source: string; // Ex: Zabbix, ServiceNow, Manual
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  slaDeadline: Timestamp | Date;
  assignedTo?: string;
  comments?: TicketComment[];
}

export interface TicketComment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: Timestamp | Date;
}