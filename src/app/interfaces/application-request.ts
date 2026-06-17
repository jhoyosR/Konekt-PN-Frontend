//Interfaz para crear una postulación
export interface ApplicationRequest {
  status: string; 
  studentId: number;
  companyComments?: string | null;
}