import { Routes } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { AuthGuard } from '../auth/auth.guard';
import { ViewOrderComponent } from './view-order/view-order.component';
import { OrderFormComponent } from './order-form/order-form.component';

export const orderRoutes: Routes = [
  {
    path: 'order/order-list',
    component: OrderListComponent,
    canActivate: [AuthGuard], // Protects Order List
    data: {
      requiredPermission: {
        module: 'order',
        subModule: 'orderList',
        permission: 'View',
      },
    },
  },
  {
    path: 'order/add-order',
    component: OrderFormComponent,
    canActivate: [AuthGuard], // Protects Add Order
    data: {
      requiredPermission: {
        module: 'order',
        subModule: 'orderList',
        permission: 'Add',
      },
    },
  },
  {
    path: 'order/edit-order/:id',
    component: OrderFormComponent,
    canActivate: [AuthGuard], // Protects Edit Order
    data: {
      requiredPermission: {
        module: 'order',
        subModule: 'orderList',
        permission: 'Update',
      },
    },
  },
  {
    path: 'order/view-order:id',
    component: ViewOrderComponent,
    canActivate: [AuthGuard], // Protects Order Details
    data: {
      requiredPermission: {
        module: 'order',
        subModule: 'orderList',
        permission: 'View',
      },
    },
  },
];
