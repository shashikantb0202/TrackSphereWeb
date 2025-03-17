import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseUrl } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class RolePermissionService {
 
  constructor(private http: HttpClient) {}

  getRoles(): Observable<any> {
    return this.http.get(`${BaseUrl.Role.Role}`);
  }

  getRolePermissions(roleId: number): Observable<any> {
    return this.http.get(`${BaseUrl.RolePermissions.RolePermissions}/${roleId}`);
  }

  bulkUpdatePermissions(updates: any[], roleId :number): Observable<any> {
    return this.http.post(`${BaseUrl.RolePermissions.BulkUpdateRolePermissions}/`+roleId, updates);
  }
}
