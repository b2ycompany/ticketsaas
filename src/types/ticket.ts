import { Timestamp } from 'firebase/firestore';

export interface Ticket {
  id?: string;
  tenantId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  source: 'manual' | 'zabbix' | 'jira' | 'servicenow';
  createdAt: Timestamp;
  slaDeadline: Timestamp;
  customerName: string;
}