import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserCheckIn, UserCheckInResponse } from '../Models/user.checkin.model';
import { environment } from '../../environments/environment';
import { BaseUrl } from '../shared/constants';

@Injectable({
  providedIn: 'root',
})
export class UserCheckInService {
  private apiUrl = `${environment.apiUrl}/UserCheckIn`;

  constructor(private http: HttpClient) {}

  getAllUserCheckInsWithFilter(params: any): Observable<UserCheckInResponse> {
    return this.http.get<UserCheckInResponse>(
      BaseUrl.UserCheckIn.UserCheckInWithFilter,
      {
        params,
      }
    );
  }
}
