import { Timestamp } from "firebase/firestore";

/**
 * VENDOR INTERFACE - B2Y GOVERNANCE
 * Define a estrutura de fornecedores externos e seus SLAs contratuais.
 */
export interface Vendor {
  id: string;
  name: string;
  defaultSla: string;
  active: boolean;
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}