import { Timestamp, FieldValue } from "firebase/firestore";

/**
 * B2Y INTEGRATION CONTRACT
 * Define a estrutura de conexão. Aceita FieldValue para serverTimestamp().
 */
export interface Integration {
  id: string;
  provider: 'jira' | 'servicenow' | 'zabbix';
  apiKey: string;
  endpoint: string;
  targetQueue: string; 
  active: boolean;
  lastSync?: Timestamp | Date | FieldValue; 
}