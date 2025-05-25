import { BaseEntity } from './base.entity.model';
import { UserBasicInfo } from './user.model';
import { StatusEnum } from '../enums/status.enum';
import { SalaryStatus } from '../enums/salary-status.enum';
import { PaymentStatusEnum } from '../enums/payment-status.enum';
import { PaymentMethodEnum } from '../enums/payment-method.enum';
import { DeductionTypeEnum } from '../enums/deduction-type.enum';
import { MonthEnum } from '../enums/month.enum';

export interface SalaryDeduction {
  deductionType: DeductionTypeEnum;
  amount: number;
  description?: string;
}

export interface MonthlySalary extends BaseEntity {
  id: number;
  user: UserBasicInfo;
  year: number;
  salaryMonth: MonthEnum;
  basicSalary: number;
  hra: number;
  allowances: number;
  deductions: SalaryDeduction[];
  totalDeductions: number;
  netSalary: number;
  salaryStatus: SalaryStatus;
  paymentMethod?: PaymentMethodEnum;
  paymentDate?: Date;
  transactionReference?: string;
  generatedOn: Date;
  updatedOn?: Date;
  createdOn: Date;
  createdBy?: UserBasicInfo;
  updatedBy?: UserBasicInfo;
  paymentRemarks?: string;
  chequeNumber?: string;
  upiReference?: string;
}
