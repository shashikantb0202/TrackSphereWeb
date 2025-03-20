import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { AddUser, Role, User, UserResponse } from '../Models/user.model';
import { BaseUrl } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}
 
  getUserByRoleId(id: number): Observable<User[]> {
    return this.http.get<{ data: User[] }>(BaseUrl.User.UserRole+'/'+id).pipe(
        map(response => response.data))
  }

  getAllUsers(params: any): Observable<any> {
    return  this.http.get<{response:UserResponse}>(BaseUrl.User.UserWithFilter, { params })
   }

   addUser(user: AddUser): Observable<any> {
    return this.http.post(`${BaseUrl.User.User}`, user);
    }

    updateUser(id: number, user: AddUser): Observable<any> {
      return this.http.put(`${BaseUrl.User.User}/${id}`, user);
    }

    getUserById(id: number): Observable<User> {
      return this.http.get<{ data: User }>(BaseUrl.User.User+'/'+id).pipe(
        map(response => response.data))
    }
}
