import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { UserPermissionService } from '../Services/user-permission.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private userPermissionService :UserPermissionService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredPermission = route.data['requiredPermission'];
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['main/unauthorized']); // Redirect to an error page
        return false;
    }
    else if (requiredPermission) {
      const {module, subModule, permission } = requiredPermission;

      if (!this.userPermissionService.hasPermission(module,subModule, permission)) {
        this.router.navigate(['main/unauthorized']); // Redirect to an error page
        return false;
      }     
    } 
   return true;
  }
}
