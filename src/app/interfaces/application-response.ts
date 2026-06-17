import { Student } from './student';
import { VacancieResponse } from './vacancie-response';
//Interfaz de la respuesta al crear una postulación
export interface ApplicationResponse {
  id: number;
  status: string;
  companyComments?: string | null;

  student: Student;
  vacancie: VacancieResponse;

  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}