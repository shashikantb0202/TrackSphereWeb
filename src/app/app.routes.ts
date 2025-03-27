import { Routes } from '@angular/router';
import { MaintenanceComponent } from './main/maintenance/maintenance/maintenance.component';
import { authRoutes } from './auth/auth.routes';
import { mainRoutes } from './main/main.routes';

export const routes: Routes = [
  ...authRoutes,
  ...mainRoutes,
  { path: '**', component: MaintenanceComponent }, // Fallback for unknown routes];
];
