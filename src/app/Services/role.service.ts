import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { Role } from '../Models/Role';
import { BaseUrl } from '../shared/constants';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private http: HttpClient) {}

  getAllRoles(): Observable<Role[]> {
    return this.http
      .get<{ data: Role[] }>(BaseUrl.Role.Role)
      .pipe(map((response) => response.data));
  }

  getRoleById(id: number): Observable<Role> {
    return this.http.get<Role>(`${BaseUrl.Role.Role}/${id}`);
  }

  addRole(role: Partial<Role>): Observable<Role> {
    return this.http.post<Role>(BaseUrl.Role.Role, role);
  }

  updateRole(role: Partial<Role>): Observable<Role> {
    return this.http.put<Role>(`${BaseUrl.Role.Role}/${role.id}`, role);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${BaseUrl.Role.Role}/${id}`);
  }
}
