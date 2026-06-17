//Interfaz para crear un estudiante
export interface StudentRegisterRequest {
  email: string;
  password: string;
  fullName: string;
  about: string;
  documentNumber: string;
  career: string;
  phone: string;
  semester: number;
  universityId: number;
}