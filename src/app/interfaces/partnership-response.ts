import { Company } from './company';
import { University } from './university';
//Interfaz de la respuesta al crear un convenio
export interface PartnershipResponse {
  id: number;
  status: string;
  comment?: string;
  university: University;
  company: Company;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}