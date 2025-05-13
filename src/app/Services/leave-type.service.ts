import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LeaveType } from '../Models/leave-type.model';
import { BaseUrl } from '../shared/constants';

@Injectable({
  providedIn: 'root',
})
export class LeaveTypeService {
  constructor(private http: HttpClient) {}

  getAllLeaveTypes(): Observable<LeaveType[]> {
    return this.http
      .get<{ data: LeaveType[] }>(BaseUrl.LeaveType.LeaveType)
      .pipe(map((response: { data: LeaveType[] }) => response.data));
  }
}
