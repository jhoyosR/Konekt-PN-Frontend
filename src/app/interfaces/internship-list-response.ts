import { IntershipResponse } from './internship-response';
//Interfaz para la paginación de las prácticas
export interface InternshipListResponse {
  data: IntershipResponse[];
  total: number;
  page: number;
  page_count: number;
  has_next: boolean;
  has_prev: boolean;
}
