import { Routes } from '@angular/router';
import { MainComponent } from '../main/main.component';
import { UnauthorizedComponent } from '../unauthorized/unauthorized.component';
import { AuthGuard } from '../auth/auth.guard';
import { dashboardRoutes } from '../dashboard/dashboard.routes';
import { userManagementRoutes } from '../user-management/user-management.routes';
import { productRoutes } from '../product/product.routes';
import { customerRoutes } from '../customer/customer.routes';

export const mainRoutes: Routes = [
  {
    path: 'main',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      ...dashboardRoutes,
      ...userManagementRoutes,
      ...productRoutes,
      ...customerRoutes,
      { path: 'unauthorized', component: UnauthorizedComponent },
    ],
  },
];
