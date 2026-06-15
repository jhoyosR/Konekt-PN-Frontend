import { University } from './university';
//Interface para la paginación de las universidades
export interface UniversityListResponse {
  data: University[];
  total: number;
  page: number;
  per_page: number;
  page_count: number;
  has_next: boolean;
  has_prev: boolean;
}