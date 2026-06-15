//Interfaz para crear una universidad
export interface UniversityRegisterRequest {
  email: string;
  password: string;
  name: string;
  nit: string;
  address: string;
  phone: string;
}