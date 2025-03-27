import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiFilterResponse } from '../Models/base.entity.model';
import { BaseUrl } from '../shared/constants';
import { ProductPackaging } from '../Models/product.packaging.model';

@Injectable({
  providedIn: 'root',
})
export class ProductPackagingService {
  constructor(private http: HttpClient) {}

  getProductPackagingById(id: number): Observable<ProductPackaging> {
    return this.http
      .get<{ data: ProductPackaging }>(
        `${BaseUrl.ProductPackaging.ProductPackaging}/${id}`
      )
      .pipe(map((response) => response.data));
  }

  getAllProductPackaging(): Observable<ProductPackaging[]> {
    return this.http
      .get<{ data: ProductPackaging[] }>(
        BaseUrl.ProductPackaging.ProductPackaging
      )
      .pipe(map((response) => response.data));
  }

  getAllProductPackagingWithFilter(params: any): Observable<any> {
    return this.http.get<{ response: ApiFilterResponse<ProductPackaging> }>(
      BaseUrl.ProductPackaging.ProductPackagingWithFilter,
      { params }
    );
  }

  updateProductPackaging(
    id: number,
    productPackaging: ProductPackaging
  ): Observable<any> {
    return this.http.put(
      `${BaseUrl.ProductPackaging.ProductPackaging}/${id}`,
      productPackaging
    );
  }

  addProductPackaging(productPackagingData: FormData): Observable<any> {
    return this.http.post(
      `${BaseUrl.ProductPackaging.ProductPackaging}`,
      productPackagingData
    );
  }
}
