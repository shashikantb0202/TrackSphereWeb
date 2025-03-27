import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { Role } from '../Models/Role';
import { BaseUrl } from '../shared/constants';
import { Customer } from '../Models/customer.model';
import { ApiFilterResponse } from '../Models/base.entity.model';
import { CustomerVisit } from '../Models/customer.visit.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerVisitService {
  constructor(private http: HttpClient) {}

  getAllCustomerVisitsWithFilter(params: any): Observable<any> {
    return this.http.get<{ response: ApiFilterResponse<CustomerVisit> }>(
      BaseUrl.CustomerVisit.CustomerVisitWithFilter,
      { params }
    );
  }

  getCustomerVisitById(id: number): Observable<CustomerVisit> {
    return this.http
      .get<{ data: CustomerVisit }>(
        BaseUrl.CustomerVisit.CustomerVisit + '/' + id
      )
      .pipe(map((response) => response.data));
  }
}
