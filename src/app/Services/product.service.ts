import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { AddUser, Role, User, UserResponse } from '../Models/user.model';
import { BaseUrl } from '../shared/constants';
import { Product, ProductResponse } from '../Models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}
 
  getProductById(id: number): Observable<Product> {
    return this.http.get<{ data: Product }>(BaseUrl.Product.Product+'/'+id).pipe(
        map(response => response.data))
  }

  getAllProductsWithFilter(params: any): Observable<any> {
    return  this.http.get<{response:ProductResponse}>(BaseUrl.Product.ProductWithFilter, { params })
   }
   updateProduct(id: number, product: Product): Observable<any> {
    return this.http.put(`${BaseUrl.Product.Product}/${id}`, product);
  }
  addProduct(productData: FormData): Observable<any> {
    return this.http.post(`${BaseUrl.Product.Product}`, productData);
    }
}