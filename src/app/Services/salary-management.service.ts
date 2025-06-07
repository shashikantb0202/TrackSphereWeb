import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseUrl } from '../shared/constants';
import { ApiFilterResponse } from '../Models/base.entity.model';
import { SalaryStructure } from '../Models/salary-structure.model';
import { MonthlySalary } from '../Models/monthly-salary.model';
import { ApiResponse } from '../Models/api-response.model';
import { SalaryStructureResponse } from '../Models/salary-structure-response.model';

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

  updateMonthlySalary(
    id: number,
    monthlySalary: Partial<MonthlySalary>
  ): Observable<{ data: MonthlySalary }> {
    return this.http.put<{ data: MonthlySalary }>(
      `${BaseUrl.Salary.MonthlySalary}/${id}`,
      monthlySalary
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

  getMonthlySalaryById(id: number): Observable<{ data: MonthlySalary }> {
    return this.http.get<{ data: MonthlySalary }>(
      `${BaseUrl.Salary.MonthlySalary}/${id}`
    );
  }

  createMonthlySalary(monthlySalary: Partial<MonthlySalary>): Observable<any> {
    return this.http.post(BaseUrl.Salary.MonthlySalary, monthlySalary);
  }

  processSalaryPayment(
    id: number
  ): Observable<{ response: ApiFilterResponse<MonthlySalary> }> {
    return this.http.put<{ response: ApiFilterResponse<MonthlySalary> }>(
      `${BaseUrl.Salary.MonthlySalary}/ProcessPayment/${id}`,
      {}
    );
  }

  getSalaryStructureByUserId(
    userId: number
  ): Observable<{ data: SalaryStructureResponse }> {
    return this.http.get<{ data: SalaryStructureResponse }>(
      `${BaseUrl.Salary.SalaryStructure}/user/${userId}`
    );
  }

  downloadSalarySlip(salaryId: number): Observable<Blob> {
    return this.http.get(`${BaseUrl.Salary.DownloadSalarySlip}/${salaryId}`, {
      responseType: 'blob',
    });
  }
}
