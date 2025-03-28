import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { Order } from '../Models/order.model';
import { ApiFilterResponse } from '../Models/base.entity.model';
import { BaseUrl } from '../shared/constants';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  getOrderById(id: number): Observable<Order> {
    return this.http
      .get<{ data: Order }>(`${BaseUrl.Order.Order}/${id}`)
      .pipe(map((response) => response.data));
  }

  getAllOrdersWithFilter(params: any): Observable<any> {
    return this.http.get<{ response: ApiFilterResponse<Order> }>(
      BaseUrl.Order.OrderWithFilter,
      { params }
    );
  }

  updateOrder(id: number, order: Order): Observable<any> {
    return this.http.put(`${BaseUrl.Order.Order}/${id}`, order);
  }

  addOrder(orderData: FormData): Observable<any> {
    return this.http.post(`${BaseUrl.Order.Order}`, orderData);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http
      .get<{ data: Order[] }>(BaseUrl.Order.OrderAll)
      .pipe(map((response) => response.data));
  }
}
