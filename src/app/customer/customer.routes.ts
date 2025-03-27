import { Routes } from '@angular/router';
import { CustomerListComponent } from './Customers/customer-list/customer-list.component';
import { CustomerFormComponent } from './Customers/customer-form/customer-form.component';
import { ViewCustomerComponent } from './Customers/view-customer/view-customer.component';
import { CustomerVisitListComponent } from './CustomerVisit/customer-visit-list/customer-visit-list.component';
import { ViewCustomerVisitComponent } from './CustomerVisit/view-customer-visit/view-customer-visit.component';
import { AuthGuard } from '../auth/auth.guard';

export const customerRoutes: Routes = [
  {
    path: 'customer/customer-list',
    component: CustomerListComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Customer',
        subModule: 'customerList',
        permission: 'View',
      },
    },
  },
  {
    path: 'customer/add-customer',
    component: CustomerFormComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Customer',
        subModule: 'customerList',
        permission: 'Add',
      },
    },
  },
  {
    path: 'customer/edit-customer/:id',
    component: CustomerFormComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Customer',
        subModule: 'customerList',
        permission: 'Update',
      },
    },
  },
  {
    path: 'customer/view-customer/:id',
    component: ViewCustomerComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Customer',
        subModule: 'customerList',
        permission: 'View',
      },
    },
  },

  {
    path: 'customer/customerVisit-list',
    component: CustomerVisitListComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Customer',
        subModule: 'CustomerVisit',
        permission: 'View',
      },
    },
  },
  {
    path: 'customer/view-customerVisit/:id',
    component: ViewCustomerVisitComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Customer',
        subModule: 'CustomerVisit',
        permission: 'View',
      },
    },
  },
];
