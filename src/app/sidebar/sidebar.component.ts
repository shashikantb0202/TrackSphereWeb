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
  sidebarMenu: Module[] = [];
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
      this.GetSideBarMenu(permission);
    }else{
      this.userPermissionService.getUserPermissions(this.loggedInUser?.id!).subscribe(data => {
        this.GetSideBarMenu(data);
          // Initialize subMenuOpen for all modules
          this.sidebarMenu.forEach(module => {
            this.subMenuOpen[module.name] = false;
        });
      });
    }
  }

  private GetSideBarMenu(data: UserPermission[]) {
    const groupedModules: { [key: string]: Module; } = {};
console.log(data)
    data.forEach(permission => {
      const module = permission.module;
      const subModule = permission.subModule;
      const permissionData = permission.permission;

      // Initialize the module if it doesn't exist
      if (!groupedModules[module.name]) {
        groupedModules[module.name] = { ...module, subModules: [] };
      }

      // Check if the subModule already exists
      const existingSubModule = groupedModules[module.name].subModules.find(
        (s) => s.id === subModule.id
      );

      if (existingSubModule) {
        // Add permission to the existing subModule if not already present
        const isPermissionExists = existingSubModule.permissions?.some(
          (p) => p.id === permissionData.id
        );

        if (!isPermissionExists) {
          existingSubModule.permissions = [
            ...(existingSubModule.permissions || []),
            permissionData
          ];
        }
      } else {
        // Add new subModule with permissions
        groupedModules[module.name].subModules.push({
          ...subModule,
          permissions: [permissionData]
        });
      }
    });
    this.sidebarMenu = Object.values(groupedModules);
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

