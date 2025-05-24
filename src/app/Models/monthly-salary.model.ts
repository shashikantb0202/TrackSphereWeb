import { BaseEntity } from './base.entity.model';
import { UserBasicInfo } from './user.model';

export interface MonthlySalary extends BaseEntity {
  id: number;
  user: UserBasicInfo;
  salaryStructureId: number;
  month: number;
  year: number;
  basicSalary: number;
  hra: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  paymentStatus: string;
  paymentDate?: Date;
  paymentReference?: string;
  isDeleted: boolean;
  createdOn: Date;
  createdBy: UserBasicInfo;
  updatedOn?: Date;
  updatedBy?: UserBasicInfo;
}
