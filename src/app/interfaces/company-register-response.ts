import { User } from './user';
import { Company } from './company';
//Interfaz de la respuesta al traer una empresa luego de crearla
export interface CompanyRegisterResponse {
  user: User;
  company: Company;
  token: string;
}