import { Timestamp } from "firebase/firestore";

export interface VendorSLA {
  priority: 'low' | 'medium' | 'high' | 'critical';
  responseTime: number; // em minutos
  resolutionTime: number; // em minutos
}

export interface Vendor {
  id: string;
  name: string;
  category: 'cloud' | 'software' | 'hardware' | 'network';
  contactEmail: string;
  active: boolean;
  slas: VendorSLA[];
  customColumns: string[]; // Filas específicas deste fornecedor
  createdAt: Timestamp | Date;
}