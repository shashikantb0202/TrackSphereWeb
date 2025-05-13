import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { LeaveBalance } from '../Models/leave-balance.model';
import { BaseUrl } from '../shared/constants';
import { ApiFilterResponse } from '../Models/base.entity.model';

@Injectable({
  providedIn: 'root',
})
export class LeaveBalanceService {
  constructor(private http: HttpClient) {}

  getLeaveBalancesWithFilter(params: any): Observable<any> {
    return this.http.get<{ response: ApiFilterResponse<LeaveBalance> }>(
      BaseUrl.LeaveBalance.LeaveBalance + '/Filter',
      { params }
    );
  }
}
