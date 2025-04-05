import { Routes } from '@angular/router';
import { ViewLocationComponent } from './view-location/view-location.component';
import { AuthGuard } from '../auth/auth.guard';

export const locationTrackerRoutes: Routes = [
  {
    path: 'location-tracker/view-location',
    component: ViewLocationComponent,
    canActivate: [AuthGuard], // Protects Order List
    data: {
      requiredPermission: {
        module: 'LocationTracker',
        subModule: 'ViewLocation',
        permission: 'View',
      },
    },
  },
];
