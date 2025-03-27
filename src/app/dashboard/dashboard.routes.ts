import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard/dashboard.component';
import { AuthGuard } from '../auth/auth.guard';

export const dashboardRoutes: Routes = [
  {
    path: 'Dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'dashboard',
        subModule: null,
        permission: 'View',
      },
    },
  },
];
