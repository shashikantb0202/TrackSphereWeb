import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { BaseUrl } from '../shared/constants';
import { Department, Designation,Location } from '../Models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor(private http: HttpClient) {}

  /** Get All Countries */
  getCountries(): Observable<Location[]> {
    return this.http.get<any>(`${BaseUrl.GeoLocation.GeoLocation}/countries`).pipe(
     map(response => response.data))
  }
  

  /** Get States by Country Id */
  getStatesByCountry(countryId: number): Observable<Location[]> {
    return this.http.get<any>(`${BaseUrl.GeoLocation.GeoLocation}/states/${countryId}`).pipe(
     map(response => response.data))
  }
  

  /** Get Cities by State Id */

  getCitiesByState(stateId: number): Observable<Location[]> {
    return this.http.get<any>(`${BaseUrl.GeoLocation.GeoLocation}/cities/${stateId}`).pipe(
     map(response => response.data))
  }
  

  /** Get All Departments */
  getDepartments(): Observable<Department[]> {
    return this.http.get<any>(`${BaseUrl.User.User}/departments`).pipe(
     map(response => response.data))
  }
 

  /** Get All Designations */
  getDesignations(): Observable<Designation[]> {
    return this.http.get<any>(`${BaseUrl.User.User}/designations`).pipe(
     map(response => response.data))
  }
}
