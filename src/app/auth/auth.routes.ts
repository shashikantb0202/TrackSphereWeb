import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const authRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirect root to login
  { path: 'login', component: LoginComponent },
];
