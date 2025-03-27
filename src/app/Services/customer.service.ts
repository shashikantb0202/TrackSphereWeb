import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { Role } from '../Models/Role';
import { BaseUrl } from '../shared/constants';
import { Customer } from '../Models/customer.model';
import { ApiFilterResponse } from '../Models/base.entity.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  getAllCustomersWithFilter(params: any): Observable<any> {
    return this.http.get<{ response: ApiFilterResponse<Customer> }>(
      BaseUrl.Customer.CustomerWithFilter,
      { params }
    );
  }
  getAllCustomers(): Observable<any> {
    return this.http
      .get<{ data: Customer[] }>(BaseUrl.Customer.Customer)
      .pipe(map((response) => response.data));
  }

  addCustomer(user: Customer): Observable<any> {
    return this.http.post(`${BaseUrl.Customer.Customer}`, user);
  }

  updateCustomer(id: number, user: Customer): Observable<any> {
    return this.http.put(`${BaseUrl.Customer.Customer}/${id}`, user);
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.http
      .get<{ data: Customer }>(BaseUrl.Customer.Customer + '/' + id)
      .pipe(map((response) => response.data));
  }
}
