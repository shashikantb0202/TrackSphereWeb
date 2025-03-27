import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import {
  Module,
  SubModule,
  UserPermission,
} from '../Models/user-permission.model';
import { environment } from '../../environment';
import { BaseUrl, STORAGE_KEYS } from '../shared/constants';

@Injectable({
  providedIn: 'root',
})
export class UserPermissionService {
  private apiUrl = environment.apiUrl; // Update with your actual API endpoint
  private permissions: any[] = [];
  constructor(private http: HttpClient) {
    const storedPermissions = localStorage.getItem(
      STORAGE_KEYS.USER_PERMISSIONS
    );
    if (storedPermissions) {
      this.permissions = JSON.parse(storedPermissions);
    } else {
    }
  }

  getPermissions(): any[] {
    const permissions = localStorage.getItem(STORAGE_KEYS.USER_PERMISSIONS);
    return permissions ? JSON.parse(permissions) : [];
  }

  // Load permissions from API response
  setPermissions(permissions: any[]): void {
    this.permissions = permissions;
    localStorage.setItem(
      STORAGE_KEYS.USER_PERMISSIONS,
      JSON.stringify(permissions)
    );
  }

  hasPermission(
    moduleName: string,
    subModuleName: string | null,
    permissionName: string
  ): boolean {
    const permissions = this.getPermissions();

    // Check for submodule-specific permission
    if (subModuleName) {
      return (
        permissions?.some(
          (p) =>
            p?.moduleName?.toLowerCase() === moduleName?.toLowerCase() &&
            p?.subModuleName?.toLowerCase() === subModuleName?.toLowerCase() &&
            p?.permissions?.[permissionName]
        ) ?? false
      );
    }

    // Check for module-level permission if submodule is not present
    return permissions.some(
      (p) =>
        p.moduleName === moduleName &&
        !p.subModuleName &&
        p.permissions[permissionName]
    );
  }

  // Clear permissions on logout
  clearPermissions(): void {
    this.permissions = [];
    localStorage.removeItem(STORAGE_KEYS.USER_PERMISSIONS);
  }
  // API Call to Get User Permissions
  getUserPermissions(userId: number): Observable<UserPermission[]> {
    return this.http
      .get<{ data: UserPermission[] }>(
        `${this.apiUrl}/api/UserPermission/user/${userId}`
      )
      .pipe(
        //  map(response => response.data || [])
        map((response) => {
          let per = response.data || [];
          this.setPermissions(per);
          return per;
        }),
        catchError(this.handleError)
      );
  }

  // Centralized Error Handling
  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      return throwError(() => new Error('Unauthorized Access. Please log in.'));
    } else if (error.status === 403) {
      return throwError(
        () => new Error('Forbidden: You do not have permission.')
      );
    } else if (error.status === 404) {
      return throwError(() => new Error('User permissions not found.'));
    } else {
      return throwError(() => new Error('An unexpected error occurred.'));
    }
  }

  getUserPermissionsGroup(userId: number): Observable<any> {
    return this.http
      .get<{ data: any }>(
        `${BaseUrl.UserPermissions.UserPermissiongroup}/${userId}`
      )
      .pipe(
        //  map(response => response.data || [])
        map((response) => {
          let per = response.data || [];
          // this.setPermissions(per);
          return per;
        }),
        catchError(this.handleError)
      );
  }

  bulkUpdatePermissions(updates: any[], roleId: number): Observable<any> {
    return this.http.post(
      `${BaseUrl.UserPermissions.BulkUpdateUserPermissions}/` + roleId,
      updates
    );
  }
}
