import { UserBasicInfo } from './user.model';
import { LeaveType } from './leave-type.model';
import { LeaveStatus } from '../enums/leave-status.enum';

export interface UserLeave {
  id: number;
  userId: number;
  user: UserBasicInfo;
  leaveTypeId: number;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  leaveStatus: LeaveStatus;
  reason: string;
  year: number;
}

export interface UserLeaveFilter {
  year?: number;
  userId?: number;
  leaveTypeId?: number;
  status?: LeaveStatus;
  pageSize: number;
  page: number;
  sortColumn?: string;
  sortDirection?: string;
}
