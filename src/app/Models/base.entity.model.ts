import { StatusEnum } from '../enums/status.enum';

export interface BaseEntity {
  id: number;
  createdBy?: BasicInfoBaseEntity;
  createdOn: Date; // ISO date string format
  updatedBy?: BasicInfoBaseEntity;
  organization?: BasicInfoBaseEntity;
  updatedOn?: Date;
  status: StatusEnum;
}

export interface BasicInfoBaseEntity {
  id: number;
  name: string;
}

export interface ApiFilterResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  errors: any[];
  totalRecords: number;
}
