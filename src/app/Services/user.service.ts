import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { AddUser, User, UserResponse } from '../Models/user.model';
import { Role } from '../Models/Role';
import { BaseUrl } from '../shared/constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUserByRoleId(id: number): Observable<User[]> {
    return this.http
      .get<{ data: User[] }>(BaseUrl.User.UserRole + '/' + id)
      .pipe(map((response) => response.data));
  }

  getAllUsersWithFilter(params: any): Observable<any> {
    return this.http.get<{ response: UserResponse }>(
      BaseUrl.User.UserWithFilter,
      { params }
    );
  }

  getAllUser(): Observable<any> {
    return this.http
      .get<{ data: User[] }>(BaseUrl.User.UserAll)
      .pipe(map((response) => response.data));
  }

  addUser(user: AddUser): Observable<any> {
    return this.http.post(`${BaseUrl.User.User}`, user);
  }

  updateUser(id: number, user: AddUser): Observable<any> {
    return this.http.put(`${BaseUrl.User.User}/${id}`, user);
  }

  getUserById(id: number): Observable<User> {
    return this.http
      .get<{ data: User }>(BaseUrl.User.User + '/' + id)
      .pipe(map((response) => response.data));
  }
}
