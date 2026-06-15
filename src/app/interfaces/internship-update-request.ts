//Interfaz para crear una actualización de una práctica
export interface InternshipUpdateRequest {
  title: string;
  description: string;
  internshipId: number;
}