//Interfaz para crear una vacante
export interface VacancieRequest {
  title: string;
  description: string;
  requirements: string;
  salary: number;
  location: string;
  modality: string;
  status: string;
  companyId: number;
}
