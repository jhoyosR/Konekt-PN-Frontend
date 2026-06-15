import { User } from './user';
//Interfaz de una empresa
export interface Company {
  id: number;
  name: string;
  description: string;
  nit: string;
  industry: string;
  address: string;
  phone: string;
  user: User;
  profilePhotoUrl?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}