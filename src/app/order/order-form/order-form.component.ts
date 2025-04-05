import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../Services/customer.service';
import { Order } from '../../Models/order.model';
import { Customer } from '../../Models/customer.model';
import { ProductPackaging } from '../../Models/product.packaging.model';
import { OrderService } from '../../Services/order.service';
import { ProductPackagingService } from '../../Services/product-packaging.service';
import { CommonModule } from '@angular/common';
import { OrderStatusEnum } from '../../enums/order-status.enum';
import { PaymentStatusEnum } from '../../enums/payment-status.enum';
import { enumToStringArray } from '../../utils/common.utils';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../Models/user.model';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class OrderFormComponent implements OnInit {
  orderForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  isSubmitted = false;
  orderId: number | undefined;

  // Lists for dropdowns
  customerList: Customer[] = [];
  productPackList: ProductPackaging[] = [];
  orderStatusList: string[] = enumToStringArray(OrderStatusEnum);
  paymentStatusList: string[] = enumToStringArray(PaymentStatusEnum);
  currentUserId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private customerService: CustomerService,
    private productPackagingService: ProductPackagingService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadLists();
    this.orderId = Number(this.route.snapshot.params['id']);
    if (this.orderId) {
      this.isEditMode = true;
      this.loadOrder();
    }
    this.getCurrentUserId();
  }

  private initForm(): void {
    this.orderForm = this.fb.group({
      customerId: [null, Validators.required],
      orderDate: ['', Validators.required],
      orderStatus: ['', Validators.required],
      paymentStatus: ['', Validators.required],
      userId: [this.currentUserId],
      totalAmount: ['', [Validators.required, Validators.min(0)]],
      orderItems: this.fb.array([]),
    });
  }

  // Getter for order items FormArray
  get orderItems() {
    return this.orderForm.get('orderItems') as FormArray;
  }

  // Load all required lists
  private loadLists(): void {
    this.loadCustomers();
    this.loadProductPacks();
  }

  // Load customers list
  private loadCustomers(): void {
    this.customerService.getAllCustomers().subscribe({
      next: (data: Customer[]) => {
        this.customerList = data;
      },
      error: (error: any) => {
        console.error('Error loading customers:', error);
        this.toastr.error('Error loading customers');
      },
    });
  }

  // Load product packs list
  private loadProductPacks(): void {
    this.productPackagingService.getAllProductPackaging().subscribe({
      next: (data: ProductPackaging[]) => {
        this.productPackList = data;
      },
      error: (error: any) => {
        console.error('Error loading product packs:', error);
        this.toastr.error('Error loading product packs');
      },
    });
  }

  // Load order details for edit mode
  private loadOrder(): void {
    this.isLoading = true;
    this.orderService.getOrderById(this.orderId!).subscribe({
      next: (order: Order) => {
        this.orderForm.patchValue({
          customerId: order.customer.id,
          orderDate: this.formatDate(order.orderDate),
          orderStatus: order.orderStatus,
          paymentStatus: order.paymentStatus,
          totalAmount: order.totalAmount,
        });

        // Clear existing items and add new ones
        while (this.orderItems.length) {
          this.orderItems.removeAt(0);
        }
        order.orderItems.forEach((item) => {
          this.orderItems.push(
            this.fb.group({
              id: [item.id],
              productPackId: [item.productPackId, Validators.required],
              productQty: [
                item.productQty,
                [Validators.required, Validators.min(1)],
              ],
              ratePerUnit: [
                item.ratePerUnit,
                [Validators.required, Validators.min(0)],
              ],
            })
          );
        });
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading order:', error);
        this.toastr.error('Error loading order');
        this.isLoading = false;
      },
    });
  }

  // Add new order item
  addOrderItem(): void {
    this.orderItems.push(
      this.fb.group({
        id: [null],
        productPackId: [null, Validators.required],
        productQty: ['', [Validators.required, Validators.min(1)]],
        ratePerUnit: ['', [Validators.required, Validators.min(0)]],
      })
    );
  }

  // Remove order item
  removeOrderItem(index: number): void {
    if (this.orderItems.length > 1) {
      this.orderItems.removeAt(index);
    }
  }

  // Format date for input field
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  // Handle form submission
  onSubmit(): void {
    this.isSubmitted = true;
    if (this.orderForm.invalid) {
      this.toastr.error('Please add at least one order item');
      return;
    }

    if (!this.currentUserId) {
      this.toastr.error('User session not found');
      return;
    }

    this.isLoading = true;
    const orderData = {
      ...this.orderForm.value,
      userId: this.currentUserId,
      ...(this.isEditMode && this.orderId ? { id: this.orderId } : {}),
    };

    if (this.isEditMode && this.orderId) {
      this.orderService.updateOrder(this.orderId, orderData).subscribe({
        next: (response) => {
          this.toastr.success(response.message);
          this.navigateToList();
        },
        error: (error: any) => {
          console.error('Error updating order:', error);
          this.toastr.error(error.message);
          this.isLoading = false;
        },
      });
    } else {
      this.orderService.addOrder(orderData).subscribe({
        next: (response) => {
          this.toastr.success(response.message);
          this.navigateToList();
        },
        error: (error: any) => {
          console.error('Error creating order:', error);
          this.toastr.error(error.message);
          this.isLoading = false;
        },
      });
    }
  }

  navigateToList(): void {
    this.router.navigate(['main/order/order-list']);
  }

  getCurrentUserId(): void {
    const currentUser = this.authService.getUserData();
    if (currentUser) {
      this.currentUserId = currentUser.id;
    } else {
      this.toastr.error('User session not found');
      this.router.navigate(['/login']);
    }
  }
}
