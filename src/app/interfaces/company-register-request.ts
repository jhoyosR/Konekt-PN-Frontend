//Interfaz para registrar/crear una empresa
export interface CompanyRegisterRequest {
  email: string;
  password: string;
  name: string;
  description: string;
  nit: string;
  industry: string;
  address: string;
  phone: string;
}