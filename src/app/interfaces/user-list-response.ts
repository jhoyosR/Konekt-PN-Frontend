import { UserResponse } from "./user-response";

export interface UserListResponse {
  data: UserResponse[];
  total: number;
  page: number;
  page_count: number;
  has_next: boolean;
  has_prev: boolean;
}