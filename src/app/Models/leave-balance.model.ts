import { UserBasicInfo } from './user.model';

export interface LeaveBalance {
  id: number;
  userId: number;
  user: UserBasicInfo;
  year: number;
  totalLeaves: number;
  usedLeaves: number;
  remainingLeaves: number;
  createdBy: UserBasicInfo;
  createdOn: Date;
  updatedBy: UserBasicInfo;
  updatedOn: Date;
  isDeleted: boolean;
}
