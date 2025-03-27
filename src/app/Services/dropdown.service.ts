import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { BaseUrl } from '../shared/constants';
import {
  CustomerTypeBasicInfo,
  CustomerVisitTypeBasicInfo,
  DepartmentBasicInfo,
  DesignationBasicInfo,
  LocationBasicInfo,
} from '../Models/common.model';

@Injectable({
  providedIn: 'root',
})
export class DropdownService {
  constructor(private http: HttpClient) {}

  /** Get All Countries */
  getCountries(): Observable<LocationBasicInfo[]> {
    return this.http
      .get<any>(`${BaseUrl.GeoLocation.GeoLocation}/countries`)
      .pipe(map((response) => response.data));
  }

  /** Get States by Country Id */
  getStatesByCountry(countryId: number): Observable<LocationBasicInfo[]> {
    return this.http
      .get<any>(`${BaseUrl.GeoLocation.GeoLocation}/states/${countryId}`)
      .pipe(map((response) => response.data));
  }

  /** Get Cities by State Id */

  getCitiesByState(stateId: number): Observable<LocationBasicInfo[]> {
    return this.http
      .get<any>(`${BaseUrl.GeoLocation.GeoLocation}/cities/${stateId}`)
      .pipe(map((response) => response.data));
  }

  /** Get All Departments */
  getDepartments(): Observable<DepartmentBasicInfo[]> {
    return this.http
      .get<any>(`${BaseUrl.User.User}/departments`)
      .pipe(map((response) => response.data));
  }

  /** Get All Designations */
  getDesignations(): Observable<DesignationBasicInfo[]> {
    return this.http
      .get<any>(`${BaseUrl.User.User}/designations`)
      .pipe(map((response) => response.data));
  }

  /** Get All Customer Type */
  getCustomerType(): Observable<CustomerTypeBasicInfo[]> {
    return this.http
      .get<any>(`${BaseUrl.Customer.CustomerType}`)
      .pipe(map((response) => response.data));
  }

  /** Get All Customer Type */
  getCustomerVisitType(): Observable<CustomerVisitTypeBasicInfo[]> {
    return this.http
      .get<any>(`${BaseUrl.CustomerVisit.CustomerVisitType}`)
      .pipe(map((response) => response.data));
  }
}
