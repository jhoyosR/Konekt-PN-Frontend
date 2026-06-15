import { SkillResponse } from './skill-response';
import { University } from './university';
import { User } from './user';
//Interface de estudiante
export interface Student {
  id: number;
  fullName: string;
  about: string;
  documentNumber: string;
  phone: string;
  career: string;
  semester: number;
  profilePhoto?: string;
  profilePhotoUrl?: string;
  resume?: string;
  resumeUrl?: string;
  user: User;
  university: University;
  skills: SkillResponse[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
