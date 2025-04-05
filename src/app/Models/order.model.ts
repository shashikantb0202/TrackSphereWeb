import { OrderStatusEnum } from '../enums/order-status.enum';
import { PaymentStatusEnum } from '../enums/payment-status.enum';
import { BaseEntity } from './base.entity.model';
import { CustomerBasicInfo } from './customer.model';
import { OrderItem } from './order.item.model';
import { UserBasicInfo } from './user.model';

export interface OrderBasicInfo {
  id: number;
  orderNumber: string;
}

export interface Order extends BaseEntity {
  id: number;
  orderNumber: string;
  customerId: number;
  customer: CustomerBasicInfo;
  userId: number;
  user: UserBasicInfo;
  orderDate: string;
  orderStatus: OrderStatusEnum;
  totalAmount: number;
  paymentStatus: PaymentStatusEnum;
  orderItems: OrderItem[];
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: Order[];
  errors: any[];
  totalRecords: number;
}
