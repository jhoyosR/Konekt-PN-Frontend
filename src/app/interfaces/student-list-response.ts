import { Student} from './student';
//Interfaz para la paginación de los estudiantes
export interface StudentListResponse {
  data: Student[];
  total: number;
  page: number;
  page_count: number;
  has_next: boolean;
  has_prev: boolean;
}