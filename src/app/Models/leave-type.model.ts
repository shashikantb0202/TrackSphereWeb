import { UserBasicInfo } from './user.model';

export interface LeaveType {
  id: number;
  leaveName: string;
  description: string;
  createdBy: UserBasicInfo;
  createdOn: Date;
  updatedBy: UserBasicInfo;
  updatedOn: Date;
  isDeleted: boolean;
}
