import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  DatatableComponent,
  NgxDatatableModule,
} from '@swimlane/ngx-datatable';
import { Order } from '../../Models/order.model';
import { HttpClient } from '@angular/common/http';
import { OrderService } from '../../Services/order.service';
import { Router } from '@angular/router';
import { GlobalStateService } from '../../Services/global-state.service';
import { UserService } from '../../Services/user.service';
import { CustomerService } from '../../Services/customer.service';
import { enumToStringArray } from '../../utils/common.utils';
import { UserBasicInfo } from '../../Models/user.model';
import { CustomerBasicInfo } from '../../Models/customer.model';
import { OrderStatusEnum } from '../../enums/order-status.enum';
import { PaymentStatusEnum } from '../../enums/payment-status.enum';

@Component({
  selector: 'app-order-list',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxDatatableModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css',
})
export class OrderListComponent implements OnInit {
  selectedOrderStatus: string = '';
  selectedPaymentStatus: string = '';
  selectedCustomerId: number = 0;
  selectedUserId: number = 0;
  orderDate: string = '';

  orders: Order[] = [];
  searchTerm: string = '';
  pageSize: number = 5;
  currentPage: number = 1;
  totalRecords: number = 0;
  sortColumn: string = '';
  sortDirection: string = '';
  isLoading: boolean = false;

  @ViewChild(DatatableComponent) ngxDatatable!: DatatableComponent;

  orderStatusList: string[] = enumToStringArray(OrderStatusEnum);
  paymentStatusList: string[] = enumToStringArray(PaymentStatusEnum);
  userList: UserBasicInfo[] = [];
  customerList: CustomerBasicInfo[] = [];

  constructor(
    private http: HttpClient,
    private orderService: OrderService,
    private userService: UserService,
    private customerService: CustomerService,
    private router: Router,
    private globalStateService: GlobalStateService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadDropdownData();
  }

  loadDropdownData(): void {
    this.userService.getAllUser().subscribe((data) => (this.userList = data));
    this.customerService
      .getAllCustomers()
      .subscribe((data) => (this.customerList = data));
  }

  navigateToAddOrder(): void {
    this.router.navigate(['main/order/add-order']);
  }

  loadOrders(): void {
    this.isLoading = true;

    const params: any = {
      page: this.currentPage.toString(),
      pageSize: this.pageSize.toString(),
      search: this.searchTerm,
      ...(this.selectedOrderStatus
        ? { orderStatus: this.selectedOrderStatus }
        : {}),

      ...(this.selectedPaymentStatus
        ? { paymentStatus: this.selectedPaymentStatus }
        : {}),
      ...(this.selectedCustomerId
        ? { customerId: this.selectedCustomerId }
        : {}),
      ...(this.selectedUserId ? { userId: this.selectedUserId } : {}),
      ...(this.orderDate ? { orderDate: this.orderDate } : {}),

      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
    };

    this.orderService.getAllOrdersWithFilter(params).subscribe({
      next: (response) => {
        this.orders = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        this.totalRecords = response.data.totalRecords;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.totalRecords = error.data;
      },
    });
  }

  searchOrders(): void {
    const trimmedText = this.searchTerm.trim();
    if (trimmedText.length >= 3 || trimmedText === '') {
      this.loadOrders();
    }
  }

  onPage(event: any): void {
    this.currentPage = event.offset + 1;
    this.loadOrders();
  }

  onSort(event: any): void {
    const sort = event.sorts[0];
    this.sortColumn = sort.prop;
    this.sortDirection = sort.dir;
    this.loadOrders();
  }

  editOrder(order: Order): void {
    this.router.navigate(['main/order/edit-order', order.id]);
  }

  viewOrder(order: Order): void {
    this.router.navigate(['main/order/view-order', order.id]);
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadOrders();
  }
}
