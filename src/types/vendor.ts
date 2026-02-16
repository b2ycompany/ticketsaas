import { Timestamp } from "firebase/firestore";

/**
 * VENDOR GOVERNANCE INTERFACE - B2Y MASTER
 * Define o contrato de performance e matriz de SLA para parceiros.
 */
export interface VendorSLA {
  priority: 'low' | 'medium' | 'high' | 'critical';
  responseTime: number;
  resolutionTime: number;
}

export interface Vendor {
  id: string;
  name: string;
  category: 'cloud' | 'software' | 'hardware' | 'network';
  contactEmail: string;
  active: boolean;
  // Campo exigido pelo Analytics
  defaultSla: string; 
  slas: VendorSLA[];
  customColumns: string[];
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}