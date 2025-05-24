import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseUrl } from '../shared/constants';
import { ApiFilterResponse } from '../Models/base.entity.model';
import { SalaryStructure } from '../Models/salary-structure.model';
import { MonthlySalary } from '../Models/monthly-salary.model';

@Injectable({
  providedIn: 'root',
})
export class SalaryManagementService {
  constructor(private http: HttpClient) {}

  getAllSalaryStructuresWithFilter(
    params: any
  ): Observable<{ data: ApiFilterResponse<SalaryStructure> }> {
    return this.http.get<{ data: ApiFilterResponse<SalaryStructure> }>(
      BaseUrl.Salary.SalaryStructure + '/Filter',
      { params }
    );
  }

  getSalaryStructureById(id: number): Observable<{ data: SalaryStructure }> {
    return this.http.get<{ data: SalaryStructure }>(
      `${BaseUrl.Salary.SalaryStructure}/${id}`
    );
  }

  createSalaryStructure(
    salaryStructure: Partial<SalaryStructure>
  ): Observable<{ data: SalaryStructure }> {
    return this.http.post<{ data: SalaryStructure }>(
      BaseUrl.Salary.SalaryStructure,
      salaryStructure
    );
  }

  updateSalaryStructure(
    id: number,
    salaryStructure: Partial<SalaryStructure>
  ): Observable<{ data: SalaryStructure }> {
    return this.http.put<{ data: SalaryStructure }>(
      `${BaseUrl.Salary.SalaryStructure}/${id}`,
      salaryStructure
    );
  }

  getAllMonthlySalariesWithFilter(
    params: any
  ): Observable<{ response: ApiFilterResponse<MonthlySalary> }> {
    return this.http.get<{ response: ApiFilterResponse<MonthlySalary> }>(
      BaseUrl.Salary.MonthlySalary + '/Filter',
      { params }
    );
  }

  getMonthlySalaryById(
    id: number
  ): Observable<{ response: ApiFilterResponse<MonthlySalary> }> {
    return this.http.get<{ response: ApiFilterResponse<MonthlySalary> }>(
      `${BaseUrl.Salary.MonthlySalary}/${id}`
    );
  }

  createMonthlySalary(
    monthlySalary: Partial<MonthlySalary>
  ): Observable<{ response: ApiFilterResponse<MonthlySalary> }> {
    return this.http.post<{ response: ApiFilterResponse<MonthlySalary> }>(
      BaseUrl.Salary.MonthlySalary,
      monthlySalary
    );
  }

  processSalaryPayment(
    id: number
  ): Observable<{ response: ApiFilterResponse<MonthlySalary> }> {
    return this.http.put<{ response: ApiFilterResponse<MonthlySalary> }>(
      `${BaseUrl.Salary.MonthlySalary}/ProcessPayment/${id}`,
      {}
    );
  }
}
