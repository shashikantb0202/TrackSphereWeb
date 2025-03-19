import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { User } from '../Models/user.model';
import { Module, UserPermission } from '../Models/user-permission.model';
import { AuthService } from '../auth/auth.service';
import { UserPermissionService } from '../Services/user-permission.service';
import { GlobalStateService } from '../Services/global-state.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    FormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})

export class SidebarComponent {
  loggedInUser: User | null = null; // Store logged-in user's name
  isCollapsed = false;
  activeItem: string = 'dashboard';
  sidebarMenu: any = [];
  subMenuOpen: { [key: string]: boolean } = {};
 
  
  constructor(private authService: AuthService,
     private userPermissionService:UserPermissionService,
     private globalStateService: GlobalStateService) {
      this.globalStateService.isCollapsed$.subscribe(
        (state) => this.isCollapsed = state
      );
     }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    this.globalStateService.setSidebarState(this.isCollapsed);  // Send updated state
  }

  ngOnInit() {
    this.loggedInUser = this.authService.getUserData(); // Get user name from AuthService
    let permission=this.userPermissionService.getPermissions();
    if(permission!=null && permission.length>0){
      this.sidebarMenu=  this.mapPermissionsToMenuStructure(permission);
    }else{
      this.userPermissionService.getUserPermissionsGroup(this.loggedInUser?.id!).subscribe(data => {
        this.sidebarMenu=  this.mapPermissionsToMenuStructure(data)
      });
    }
  }

  mapPermissionsToMenuStructure(permissions: any[]): any[] {
    const groupedModules = permissions.reduce((acc: any, curr: any) => {
      const moduleKey = curr.moduleName;
      
      // Check for module-level 'View' permission if no submodules
      const hasModuleViewPermission = !curr.subModuleId && curr.permissions?.View;

      if (!acc[moduleKey] && hasModuleViewPermission) {
        acc[moduleKey] = {
          moduleName: curr.moduleName,
          moduleTitle: curr.moduleTitle,
          icon: curr.moduleIcon,
          url: curr.moduleUrl,
          subModules: []
        };
      }
      // Check for submodule-level 'View' permission
      if (curr.subModuleId && curr.permissions?.View) {
        if (!acc[moduleKey]) {
          acc[moduleKey] = {
            moduleName: curr.moduleName,
            moduleTitle: curr.moduleTitle,
            icon: curr.moduleIcon,
            url: curr.moduleUrl,
            subModules: []
          };
        }
        acc[moduleKey].subModules.push({
          subModuleName: curr.subModuleName,
          subModuleTitle: curr.subModuleTitle,
          url: curr.subModuleUrl,
          icon: curr.subModuleIcon
        });
      }

      return acc;
    }, {});
    return Object.values(groupedModules);
}



  setActiveItem(item: string) {
    this.activeItem = item;
}

  toggleSubMenu(menuName: string) {
    this.subMenuOpen[menuName] = !this.subMenuOpen[menuName];
}

  logout() {
    this.authService.logout(); // Implement logout logic
  }

}

