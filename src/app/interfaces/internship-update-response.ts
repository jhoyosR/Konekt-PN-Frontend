import { IntershipResponse } from './internship-response';
//Interfaz de la respuesta al crear una actualización de una práctica
export interface InternshipUpdateResponse {
  id: number;
  title: string;
  description: string;
  internshipId: number;
  internship: IntershipResponse;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
