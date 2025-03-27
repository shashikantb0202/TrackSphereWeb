import { Routes } from '@angular/router';
import { RoleListComponent } from './roles/role-list/role-list.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserPermissionComponent } from './user-permission/user-permission/user-permission.component';
import { RolePermissionComponent } from './role-permission/role-permission/role-permission.component';
import { UserFormComponent } from './users/user-form-component/user-form-component';
import { ViewUserComponent } from './users/view-user/view-user.component';
import { AuthGuard } from '../auth/auth.guard';

export const userManagementRoutes: Routes = [
  {
    path: 'user-management/Role-List',
    component: RoleListComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'UserManagement',
        subModule: 'RoleList',
        permission: 'View',
      },
    },
  },
  {
    path: 'user-management/user-list',
    component: UserListComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'UserManagement',
        subModule: 'UserList',
        permission: 'View',
      },
    },
  },
  {
    path: 'user-management/user-permission',
    component: UserPermissionComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'UserManagement',
        subModule: 'UserPermission',
        permission: 'View',
      },
    },
  },
  {
    path: 'user-management/role-permission',
    component: RolePermissionComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'UserManagement',
        subModule: 'RolePermission',
        permission: 'View',
      },
    },
  },

  {
    path: 'user-management/add-user',
    component: UserFormComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'UserManagement',
        subModule: 'UserList',
        permission: 'Add',
      },
    },
  },
  {
    path: 'user-management/edit-user/:id',
    component: UserFormComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'UserManagement',
        subModule: 'UserList',
        permission: 'Update',
      },
    },
  },
  {
    path: 'user-management/view-user/:id',
    component: ViewUserComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'UserManagement',
        subModule: 'UserList',
        permission: 'View',
      },
    },
  },
];
