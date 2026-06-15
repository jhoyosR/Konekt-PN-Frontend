//Interfaz para crear una práctica
export interface IntershipRequest {
  status: string;
  startDate: string;
  endDate: string;
  arlCertification?: string;
  epsCertification?: string
  applicationId: number;
}