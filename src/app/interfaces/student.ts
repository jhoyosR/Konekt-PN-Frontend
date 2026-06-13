import { University } from './university';
import { User } from './user';

export interface Student {
  id: number;
  fullName: string;
  about: string;
  documentNumber: string;
  phone: string;
  career: string;
  semester: number;
  profilePhoto?: string;
  resume?: string;
   resumeUrl?: string;
  user: User;
  university: University;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
