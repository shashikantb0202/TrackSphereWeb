import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
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
  activeItem: string|null = 'dashboard';
  sidebarMenu: any = [];
  subMenuOpen: { [key: string]: boolean } = {};
  
 
  
  constructor(private authService: AuthService,
     private userPermissionService:UserPermissionService,
     private globalStateService: GlobalStateService,
     private router: Router) {
      this.globalStateService.isCollapsed$.subscribe(
        (state) => this.isCollapsed = state
      );
     }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    this.globalStateService.setSidebarState(this.isCollapsed);  // Send updated state
  }

  ngOnInit() {

    this.activeItem = localStorage.getItem('activeItem');
    const activeModule = localStorage.getItem('activeModule');

    if (activeModule) {
      this.subMenuOpen[activeModule] = true;
  }
   this.autoSetActiveItem();
    this.loggedInUser = this.authService.getUserData(); // Get user name from AuthService
    let permission=this.userPermissionService.getPermissions();
    if(permission!=null && permission.length>0){
      this.sidebarMenu=  this.mapPermissionsToMenuStructure(permission);
    }else{
      this.userPermissionService.getUserPermissionsGroup(this.loggedInUser?.id!).subscribe(data => {
        this.sidebarMenu=  this.mapPermissionsToMenuStructure(data)
        this.userPermissionService.setPermissions(data);
      });
    }
    console.log(JSON.stringify( this.sidebarMenu));
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
  localStorage.setItem('activeItem', item);
}


autoSetActiveItem() {
  
    const currentRoute = this.router.url;
    this.sidebarMenu.forEach((module: { subModules: any[]; moduleName: string; }) => {
      module.subModules.forEach(subModule => {
          if (currentRoute.includes(subModule.url)) {
              this.activeItem = subModule.subModuleName;
              this.subMenuOpen[module.moduleName] = true;
              localStorage.setItem('activeItem', subModule.subModuleName);
              localStorage.setItem('activeModule', module.moduleName);
          }
      });
    });
}

  toggleSubMenu(menuName: string) {
    this.subMenuOpen[menuName] = !this.subMenuOpen[menuName];
    localStorage.setItem('activeModule', menuName);
}

  logout() {
    this.authService.logout(); // Implement logout logic
  }

}

