import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../Models/user.model';
import { transformToUserModel } from '../utils/user.transform.utils';
import { environment } from '../../environments/environment';
import { STORAGE_KEYS } from '../shared/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl; // Change this based on your .NET API
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { userName: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/User/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
        localStorage.setItem(
          STORAGE_KEYS.USER_INFO,
          JSON.stringify(response.data.user)
        );
      })
    );
  }

  forgotPassword(credentials: { Email: string }): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/api/User/request-password-reset`, credentials)
      .pipe(tap((response: any) => {}));
  }

  resetPassword(credentials: {
    token: string;
    newPassword: string;
  }): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/api/User/reset-password`, credentials)
      .pipe(tap((response: any) => {}));
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/register`, user);
  }

  logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
    localStorage.removeItem(STORAGE_KEYS.USER_PERMISSIONS);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  getUserData(): User | null {
    let userata = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_INFO)!);
    return transformToUserModel(userata);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }
}
