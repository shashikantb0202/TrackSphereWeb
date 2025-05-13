import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { Holiday } from '../Models/holiday.model';
import { BaseUrl } from '../shared/constants';

@Injectable({
  providedIn: 'root',
})
export class HolidayService {
  constructor(private http: HttpClient) {}

  getHolidaysByYear(year: number): Observable<Holiday[]> {
    return this.http
      .get<{ data: Holiday[] }>(`${BaseUrl.Holiday.Holiday}/by-year/${year}`)
      .pipe(map((response) => response.data));
  }

  getHolidayById(id: number): Observable<Holiday> {
    return this.http
      .get<{ data: Holiday }>(`${BaseUrl.Holiday.Holiday}/${id}`)
      .pipe(map((response) => response.data));
  }

  addHoliday(holiday: Partial<Holiday>): Observable<Holiday> {
    return this.http
      .post<{ data: Holiday }>(BaseUrl.Holiday.Holiday, holiday)
      .pipe(map((response) => response.data));
  }

  updateHoliday(holiday: Partial<Holiday>): Observable<Holiday> {
    return this.http
      .put<{ data: Holiday }>(
        `${BaseUrl.Holiday.Holiday}/${holiday.id}`,
        holiday
      )
      .pipe(map((response) => response.data));
  }

  deleteHoliday(id: number): Observable<void> {
    return this.http.delete<void>(`${BaseUrl.Holiday.Holiday}/${id}`);
  }
}
