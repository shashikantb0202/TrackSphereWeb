export interface SalaryStructureResponse {
  id: number;
  userId: number;
  basicSalary: number;
  hra: number;
  allowances: number;
  pfPercent: number;
  deductions: number;
  status: string;
  createdBy: string;
  createdOn: Date;
  updatedBy?: string;
  updatedOn?: Date;
}
