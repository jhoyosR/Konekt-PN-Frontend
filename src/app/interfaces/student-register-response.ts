import { Student } from './student';
import { User } from './user';
//Interfaz de respuesta para cuando se crea un estudiante
export interface StudentRegisterResponse {
  user: User;
  student: Student;
  token: string;
}
