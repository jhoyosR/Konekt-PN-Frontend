import { ApplicationResponse } from "./application-response";
//Interfaz de las paginación de las postulaciones
export interface ApplicationListResponse {
  data: ApplicationResponse[];
  total: number;
  page: number;
  page_count: number;
  has_next: boolean;
  has_prev: boolean;
}