import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Packaging, PackagingBasicInfo, Unit } from '../Models/packaging.model';
import { ApiFilterResponse } from '../Models/base.entity.model';
import { BaseUrl } from '../shared/constants';

@Injectable({
  providedIn: 'root',
})
export class PackagingService {
  constructor(private http: HttpClient) {}

  getPackagingById(id: number): Observable<Packaging> {
    return this.http
      .get<{ data: Packaging }>(`${BaseUrl.Packaging.Packaging}/${id}`)
      .pipe(map((response) => response.data));
  }

  getAllPackaging(): Observable<PackagingBasicInfo[]> {
    return this.http
      .get<{ data: PackagingBasicInfo[] }>(BaseUrl.Packaging.Packaging)
      .pipe(map((response) => response.data));
  }

  getAllPackagingWithFilter(params: any): Observable<any> {
    return this.http.get<{ response: ApiFilterResponse<Packaging> }>(
      BaseUrl.Packaging.PackagingWithFilter,
      { params }
    );
  }

  updatePackaging(id: number, packaging: Packaging): Observable<any> {
    return this.http.put(`${BaseUrl.Packaging.Packaging}/${id}`, packaging);
  }

  addPackaging(packagingData: FormData): Observable<any> {
    return this.http.post(`${BaseUrl.Packaging.Packaging}`, packagingData);
  }

  getAllUnits(): Observable<Unit[]> {
    return this.http
      .get<{ data: Unit[] }>(BaseUrl.Unit.Unit)
      .pipe(map((response) => response.data));
  }
}
