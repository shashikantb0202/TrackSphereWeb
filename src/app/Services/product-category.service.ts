import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { AddUser, User, UserResponse } from '../Models/user.model';
import { Role } from '../Models/Role';
import { BaseUrl } from '../shared/constants';
import { Product, ProductResponse } from '../Models/product.model';
import { ProductCategory } from '../Models/Product.category.model';
import { ApiFilterResponse } from '../Models/base.entity.model';

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryService {
  constructor(private http: HttpClient) {}

  getCategoryById(id: number): Observable<ProductCategory> {
    return this.http
      .get<{ data: ProductCategory }>(
        `${BaseUrl.ProductCategory.ProductCategory}/${id}`
      )
      .pipe(map((response) => response.data));
  }

  getAllProductsCategory(): Observable<ProductCategory[]> {
    return this.http
      .get<any>(BaseUrl.ProductCategory.ProductCategory)
      .pipe(map((response) => response.data));
  }

  getAllCategoriesWithFilter(params: any): Observable<any> {
    return this.http.get<{ response: ApiFilterResponse<ProductCategory> }>(
      BaseUrl.ProductCategory.ProductCategoryWithFilter,
      { params }
    );
  }

  updateCategory(id: number, category: ProductCategory): Observable<any> {
    return this.http.put(
      `${BaseUrl.ProductCategory.ProductCategory}/${id}`,
      category
    );
  }

  addCategory(categoryData: FormData): Observable<any> {
    return this.http.post(
      `${BaseUrl.ProductCategory.ProductCategory}`,
      categoryData
    );
  }
}
