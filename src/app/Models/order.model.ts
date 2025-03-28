import { OrderStatusEnum } from '../enums/order-status.enum';
import { PaymentStatusEnum } from '../enums/payment-status.enum';
import { BaseEntity } from './base.entity.model';
import { CustomerBasicInfo } from './customer.model';
import { OrderItem } from './order.item.model';
import { UserBasicInfo } from './user.model';

export interface Order extends BaseEntity {
  id: number;
  customer: CustomerBasicInfo;
  user: UserBasicInfo;
  orderDate: string;
  orderStatus: OrderStatusEnum;
  totalAmount: number;
  paymentStatus: PaymentStatusEnum;
  orderItems: OrderItem[];
}
