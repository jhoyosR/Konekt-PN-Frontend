import { User } from './user';
import { University } from './university';
//Interfaz de respuesta al crear una universidad
export interface UniversityRegisterResponse {
  user: User;
  university: University;
  token: string;
}