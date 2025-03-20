import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { MainComponent } from './main/main.component';
import { AuthGuard } from './auth/auth.guard';
import { RoleListComponent } from './user-management/roles/role-list/role-list.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { UserListComponent } from './user-management/users/user-list/user-list.component';
import { UserPermissionComponent } from './user-management/user-permission/user-permission/user-permission.component';
import { RolePermissionComponent } from './user-management/role-permission/role-permission/role-permission.component';
import { UserFormComponent } from './user-management/users/user-form-component/user-form-component';
import { ViewUserComponent } from './user-management/users/view-user/view-user.component';
import { MaintenanceComponent } from './main/maintenance/maintenance/maintenance.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductFormComponent } from './product/produt-form/product-form.component';
import { ViewProductComponent } from './product/view-product/view-product.component';

export const routes: Routes = [ 
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirect root to login
    { path: 'login', component: LoginComponent },
    { path: 'main',
        children: [
            
            {
            path: 'user-management/Role-List',
            component: RoleListComponent,
            canActivate: [AuthGuard],
            data: { requiredPermission: {module:"UserManagement", subModule: 'RoleList', permission: 'View' } }
          },
          {
            path: 'user-management/user-list',
            component: UserListComponent,
            canActivate: [AuthGuard],
            data: { requiredPermission: {module:"UserManagement", subModule: 'UserList', permission: 'View' } }
          },
          {
            path: 'user-management/user-permission',
            component: UserPermissionComponent,
            canActivate: [AuthGuard],
            data: { requiredPermission: {module:"UserManagement", subModule: 'UserPermission', permission: 'View' } }
          },
          {
            path: 'user-management/role-permission',
            component: RolePermissionComponent,
            canActivate: [AuthGuard],
            data: { requiredPermission: {module:"UserManagement", subModule: 'RolePermission', permission: 'View' } }
          },

          {
            path: 'user-management/add-user',
            component: UserFormComponent,
            canActivate: [AuthGuard],
            data: { requiredPermission: {module:"UserManagement", subModule: 'UserList', permission: 'Add' } }
          },
          {
            path: 'user-management/edit-user/:id',
            component: UserFormComponent,
            canActivate: [AuthGuard],
            data: { requiredPermission: {module:"UserManagement", subModule: 'UserList', permission: 'Update' } }
          },
          {
            path: 'user-management/view-user/:id',
            component: ViewUserComponent,
            canActivate: [AuthGuard],
            data: { requiredPermission: {module:"UserManagement", subModule: 'UserList', permission: 'View' } }
          },
          {
            path: 'product/product-list',
            component: ProductListComponent,
            canActivate: [AuthGuard],
            data: { requiredPermission: {module:"Product", subModule: 'ProductList', permission: 'View' } }
          },
          {
            path: 'product/add-product',
            component: ProductFormComponent,
            canActivate: [AuthGuard],
            data: { requiredPermission: {module:"Product", subModule: 'ProductList', permission: 'Add' } }
          },
          {
            path: 'product/edit-product/:id',
            component: ProductFormComponent,
            canActivate: [AuthGuard],
            data: { requiredPermission: {module:"Product", subModule: 'ProductList', permission: 'Update' } }
          },
          {
            path: 'product/view-product/:id',
            component: ViewProductComponent,
            canActivate: [AuthGuard],
            data: { requiredPermission: {module:"Product", subModule: 'ProductList', permission: 'View' } }
          },
          {
            path: 'unauthorized',
            component: UnauthorizedComponent 
          }
        ],
        component: MainComponent, canActivate: [AuthGuard] },
    { path: '**', component: MaintenanceComponent }, // Fallback for unknown routes];
    
    
]