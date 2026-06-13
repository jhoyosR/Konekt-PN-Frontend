import { PartnershipResponse } from './partnership-response';

export interface PartnershipListResponse {
  data: PartnershipResponse[];
  total: number;
  page: number;
  page_count: number;
  has_next: boolean;
  has_prev: boolean;
}