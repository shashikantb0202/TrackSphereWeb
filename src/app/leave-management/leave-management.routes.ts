import { Routes } from '@angular/router';
import { HolidayListComponent } from './holidays/holiday-list/holiday-list.component';
import { LeaveBalanceListComponent } from './leave-balances/leave-balance-list/leave-balance-list.component';
import { UserLeaveListComponent } from './user-leaves/user-leave-list/user-leave-list.component';
import { AuthGuard } from '../auth/auth.guard';

export const leaveManagementRoutes: Routes = [
  {
    path: 'leave-management/holiday-list',
    component: HolidayListComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Leave',
        subModule: 'HolidayList',
        permission: 'View',
      },
    },
  },
  {
    path: 'leave-management/leave-balance-list',
    component: LeaveBalanceListComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Leave',
        subModule: 'LeaveBalanceList',
        permission: 'View',
      },
    },
  },
  {
    path: 'leave-management/user-leaves',
    component: UserLeaveListComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Leave',
        subModule: 'UserLeaves',
        permission: 'View',
      },
    },
  },
];
