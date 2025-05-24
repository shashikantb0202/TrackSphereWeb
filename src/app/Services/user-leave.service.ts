import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserLeave } from '../Models/user-leave.model';
import { BaseUrl } from '../shared/constants';
import { ApiFilterResponse } from '../Models/base.entity.model';
import { LeaveStatus } from '../enums/leave-status.enum';

@Injectable({
  providedIn: 'root',
})
export class UserLeaveService {
  constructor(private http: HttpClient) {}

  getUserLeavesWithFilter(params: any): Observable<any> {
    return this.http.get<{ response: ApiFilterResponse<UserLeave> }>(
      BaseUrl.UserLeave.UserLeave + '/Filter',
      { params }
    );
  }

  updateUserLeave(
    id: number,
    userLeave: Partial<UserLeave>
  ): Observable<{ response: ApiFilterResponse<UserLeave> }> {
    return this.http.put<{ response: ApiFilterResponse<UserLeave> }>(
      `${BaseUrl.UserLeave.UserLeave}/${id}`,
      userLeave
    );
  }

  updateLeaveStatus(
    id: number,
    status: LeaveStatus
  ): Observable<{ response: ApiFilterResponse<UserLeave> }> {
    return this.http.put<{ response: ApiFilterResponse<UserLeave> }>(
      `${BaseUrl.UserLeave.UserLeave}/UpdateStatus/${id}`,
      { Id: id, LeaveStatus: status }
    );
  }
}
