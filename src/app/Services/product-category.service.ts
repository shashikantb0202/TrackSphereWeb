import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { AddUser, Role, User, UserResponse } from '../Models/user.model';
import { BaseUrl } from '../shared/constants';
import { Product, ProductCategory, ProductResponse } from '../Models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {
  constructor(private http: HttpClient) {}
 
  getAllProductsCategory(): Observable<ProductCategory[]> {
    return  this.http.get<any>(BaseUrl.ProductCategory.ProductCategory ).pipe(
      map(response => response.data))
   }
  
}