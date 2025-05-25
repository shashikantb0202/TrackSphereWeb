import { Routes } from '@angular/router';
import { UserSalaryStructureListComponent } from './user-salary-structure/user-salary-structure-list/user-salary-structure-list.component';
import { UserSalaryStructureFormComponent } from './user-salary-structure/user-salary-structure-form/user-salary-structure-form.component';
import { AuthGuard } from '../auth/auth.guard';
import { ViewSalaryStructureComponent } from './user-salary-structure/view-salary-structure/view-salary-structure.component';
import { UserMonthlySalaryListComponent } from './user-monthly-salary/user-monthly-salary-list/user-monthly-salary-list.component';
import { UserMonthlySalaryFormComponent } from './user-monthly-salary/user-monthly-salary-form/user-monthly-salary-form.component';
import { UserMonthlySalaryViewComponent } from './user-monthly-salary/user-monthly-salary-view/user-monthly-salary-view.component';

export const salaryManagementRoutes: Routes = [
  {
    path: 'salary-management/salary-structures',
    component: UserSalaryStructureListComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Salary',
        subModule: 'SalaryStructures',
        permission: 'View',
      },
    },
  },
  {
    path: 'salary-management/salary-structures/add',
    component: UserSalaryStructureFormComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Salary',
        subModule: 'SalaryStructures',
        permission: 'Add',
      },
    },
  },
  {
    path: 'salary-management/salary-structures/edit/:id',
    component: UserSalaryStructureFormComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Salary',
        subModule: 'SalaryStructures',
        permission: 'Update',
      },
    },
  },
  {
    path: 'salary-management/salary-structures/view/:id',
    component: ViewSalaryStructureComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Salary',
        subModule: 'SalaryStructures',
        permission: 'View',
      },
    },
  },
  {
    path: 'salary-management/monthly-salaries',
    component: UserMonthlySalaryListComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Salary',
        subModule: 'MonthlySalaries',
        permission: 'View',
      },
    },
  },
  {
    path: 'salary-management/monthly-salaries/add',
    component: UserMonthlySalaryFormComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Salary',
        subModule: 'MonthlySalaries',
        permission: 'Add',
      },
    },
  },
  {
    path: 'salary-management/monthly-salaries/edit/:id',
    component: UserMonthlySalaryFormComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Salary',
        subModule: 'MonthlySalaries',
        permission: 'Update',
      },
    },
  },
  {
    path: 'salary-management/monthly-salaries/view/:id',
    component: UserMonthlySalaryViewComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Salary',
        subModule: 'MonthlySalaries',
        permission: 'View',
      },
    },
  },
];
