import { StatusEnum } from '../enums/status.enum';
import { BaseEntity } from './base.entity.model';
import { UserBasicInfo } from './user.model';

export interface SalaryStructure extends BaseEntity {
  id: number;
  user?: UserBasicInfo;
  userId: number;
  basicSalary: number;
  hra: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  effectiveFrom: Date;
  isDeleted: boolean;
  createdOn: Date;
  createdBy?: UserBasicInfo;
  updatedOn?: Date;
  updatedBy?: UserBasicInfo;
  status: StatusEnum;
}
