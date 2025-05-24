import { Routes } from '@angular/router';
import { UserSalaryStructureListComponent } from './user-salary-structure/user-salary-structure-list/user-salary-structure-list.component';
import { UserSalaryStructureFormComponent } from './user-salary-structure/user-salary-structure-form/user-salary-structure-form.component';
import { AuthGuard } from '../auth/auth.guard';
import { ViewSalaryStructureComponent } from './user-salary-structure/view-salary-structure/view-salary-structure.component';

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
    component: ViewSalaryStructureComponent, // TODO: Replace with MonthlySalaryListComponent
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Salary',
        subModule: 'SalaryStructures',
        permission: 'View',
      },
    },
  },
];
