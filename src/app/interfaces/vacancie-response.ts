import { Company } from './company';
import { SkillResponse } from './skill-response';
//Interfaz de respuesta al crear una vacante
export interface VacancieResponse {
  id: number;
  title: string;
  description: string;
  requirements: string;
  salary: number;
  location: string;
  modality: string;
  status: string;
  company: Company;
  skills: SkillResponse[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
