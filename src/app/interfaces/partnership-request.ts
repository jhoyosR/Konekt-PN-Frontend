//Interfaz para crear un convenio
export interface PartnershipRequest {
  comment?: string;
  status: string;
  companyId: number;
  universityId: number;
}