import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../Services/order.service';
import { Order } from '../../Models/order.model';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-view-order',
  standalone: true,
  imports: [CommonModule, DateFormatPipe],
  providers: [DatePipe, DateFormatPipe],
  templateUrl: './view-order.component.html',
  styleUrl: './view-order.component.css',
})
export class ViewOrderComponent implements OnInit {
  orderId: number = 0;
  isLoading: boolean = false;
  order: Order | any = {};

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getOrderDetails();
  }

  private getOrderDetails(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoading = true;
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (orderData) => {
        this.order = orderData;
        this.order.orderDate = new Date(orderData.orderDate);
        if (orderData.createdOn) {
          this.order.createdOn = new Date(orderData.createdOn);
        }
        if (orderData.updatedOn) {
          this.order.updatedOn = new Date(orderData.updatedOn);
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  editOrder(): void {
    this.router.navigate(['main/order/edit-order', this.order.id]);
  }

  navigateToView(id: number): void {
    this.router.navigate(['main/order/view-order', id]);
  }

  getTotalQuantity(): number {
    return (
      this.order.orderItems?.reduce(
        (total: number, item: any) => total + item.productQty,
        0
      ) || 0
    );
  }

  getSubtotal(): number {
    return (
      this.order.orderItems?.reduce(
        (total: number, item: any) =>
          total + item.productQty * item.ratePerUnit,
        0
      ) || 0
    );
  }
}
