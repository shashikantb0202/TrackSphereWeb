import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { Role, User } from '../Models/user.model';
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
}
