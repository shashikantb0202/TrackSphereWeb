import { UserBasicInfo } from './user.model';

export interface LocationTracker {
  id: number;
  user: UserBasicInfo;
  latitude: number;
  longitude: number;
  timestamp: string;
  type: string;
}

export interface LocationTrackerResponse {
  data: LocationTracker[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}
