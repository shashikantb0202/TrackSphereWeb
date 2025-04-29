import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

export const authRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirect root to login
  { path: 'login', component: LoginComponent },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
      ),
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
];
