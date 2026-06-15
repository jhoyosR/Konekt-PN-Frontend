import { ApplicationResponse } from './application-response';
//Respuesta al traer/crear una práctica
export interface IntershipResponse {
  id: number;
  status: string;
  startDate: string;
  endDate: string;
  applicationId: number;
  application: ApplicationResponse;
  arlCertification?: string;
  epsCertification?: string;
  arlCertificationUrl?: string;
  epsCertificationUrl?: string;
  createdAt: string;
  updatedAt: string;
}
