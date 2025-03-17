import { StatusEnum } from "../enums/status.enum";

export interface BaseEntity {
  id: number;
  createdBy?:BasicInfoBaseEntity;
  createdOn: string; // ISO date string format
  updatedBy?:BasicInfoBaseEntity;
  updatedOn?: string;
  status: StatusEnum;
}

export interface BasicInfoBaseEntity {
    id: number;
    name: string;
}