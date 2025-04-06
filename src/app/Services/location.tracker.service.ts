import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LocationTracker,
  LocationTrackerResponse,
} from '../Models/location.tracker.model';
import { environment } from '../../environment';
import { ApiFilterResponse } from '../Models/base.entity.model';
import { BaseUrl } from '../shared/constants';

@Injectable({
  providedIn: 'root',
})
export class LocationTrackerService {
  private apiUrl = `${environment.apiUrl}/api/LocationTracker`;

  constructor(private http: HttpClient) {}

  getAllLocationTrackersWithFilter(params: any): Observable<any> {
    return this.http.get<{ response: ApiFilterResponse<LocationTracker> }>(
      BaseUrl.locationtrackers.locationtrackersWithFilter,
      { params }
    );
  }
}
