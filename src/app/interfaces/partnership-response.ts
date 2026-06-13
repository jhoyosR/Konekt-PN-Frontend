import { Company } from './company';
import { University } from './university';

export interface PartnershipResponse {
  id: number;
  status: string;
  comment: string;
  university: University;
  company: Company;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}