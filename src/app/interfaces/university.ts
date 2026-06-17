import { User } from './user';
//Interfaz de universidad
export interface University {
  id: number;
  name: string;
  nit: string;
  address: string;
  phone: string;
  user: User;
  profilePhoto?: string;
  profilePhotoUrl?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
