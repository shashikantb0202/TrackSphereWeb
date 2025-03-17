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

export const routes: Routes = [ 
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirect root to login
    { path: 'login', component: LoginComponent },
    { path: 'main',
        children: [
            
            {
            path: 'user-management/Role-List',
            component: RoleListComponent,
            canActivate: [AuthGuard],
            data: { requiredPermission: { subModule: 'RoleList', permission: 'View' } }
          },
          {
            path: 'user-management/user-list',
            component: UserListComponent,
            canActivate: [AuthGuard],
            data: { requiredPermission: { subModule: 'UserList', permission: 'View' } }
          },
          {
            path: 'user-management/user-permission',
            component: UserPermissionComponent,
            canActivate: [AuthGuard],
            data: { requiredPermission: { subModule: 'UserPermission', permission: 'View' } }
          },
          {
            path: 'user-management/role-permission',
            component: RolePermissionComponent,
            canActivate: [AuthGuard],
            data: { requiredPermission: { subModule: 'RolePermission', permission: 'View' } }
          },
          {
            path: 'unauthorized',
            component: UnauthorizedComponent 
          }
        ],
        component: MainComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'login' }, // Fallback for unknown routes];
    
    
]