import { UserBasicInfo } from './user.model';

export interface Holiday {
  id: number;
  name: string;
  date: string;
  year: number;
  description: string;
  createdBy: UserBasicInfo;
  createdOn: string;
  updatedBy?: UserBasicInfo;
  updatedOn?: string;
  isDeleted: boolean;
}
