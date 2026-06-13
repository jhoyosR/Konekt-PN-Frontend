import { User } from './user';

export interface University {
  id: number;
  name: string;
  nit: string;
  address: string;
  phone: string;
  user: User;
  profilePhoto?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}