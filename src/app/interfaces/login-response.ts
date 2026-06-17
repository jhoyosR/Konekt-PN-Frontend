import { User } from './user';
//Interfaz de respuesta al iniciar sesión
export interface LoginResponse {
  user: User;
  token: string;
}