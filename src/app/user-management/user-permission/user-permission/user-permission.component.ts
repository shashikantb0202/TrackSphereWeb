import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RoleService } from '../../../Services/role.service';
import { UserService } from '../../../Services/user.service';
import { UserPermissionService } from '../../../Services/user-permission.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermissionEnum } from '../../../enums/permission.enum';
import { enumToStringArray } from '../../../utils/common.utils';

@Component({
  selector: 'app-user-permission',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-permission.component.html',
  styleUrl: './user-permission.component.css'
})
export class UserPermissionComponent implements OnInit {
isLoading: boolean = false;
  roles: any[] = [];
  users: any[] = [];
  selectedRole: number | null=null;
  selectedUser: number | null=null;
  permissions: any[] = [];
  permissionHeaders: string[] = enumToStringArray(PermissionEnum);   // Dynamic headers

  constructor(
    private roleService: RoleService,
    private userService: UserService,
    private userPermissionService: UserPermissionService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.roleService.getAllRoles().subscribe((data) => {
      this.roles = data;
    });
  }

  loadUsersByRoleId(roleId: number): void {
    this.userService.getUserByRoleId(roleId).subscribe((data) => {
      this.users = data;
    });
  }
  // Full Access Logic
toggleFullAccess(item: any): void {
  var allEnabled =false;
  if (item.permissions) {
    allEnabled = this.isFullAccess(item.permissions);
    // Toggle all permissions ON or OFF
    Object.keys(item.permissions).forEach((perm) => {
      item.permissions[perm] = !allEnabled;
    });
  }
  else if(item.modulePermissions){
    allEnabled = this.isFullAccess(item.modulePermissions);
    // Toggle all permissions ON or OFF
    Object.keys(item.modulePermissions).forEach((perm) => {
      item.modulePermissions[perm] = !allEnabled;
});
  }
}

// Check if All Permissions are Enabled
isFullAccess(permissions: any): boolean {
  return Object.values(permissions).every(value => value === true);
}

onRoleChange(): void {
  if (this.selectedRole) {
    this.loadUsersByRoleId(this.selectedRole);
  }
}
  onUserChange(): void {
    if (this.selectedUser) {
      this.isLoading = true; 
      this.userPermissionService.getUserPermissionsGroup(this.selectedUser).subscribe((response) => {
        this.transformPermissions(response);
        this.isLoading = false; 
      });
    }
  }
 // Toggle Module Collapse
 toggleCollapse(module: any): void {
  module.collapsed = !module.collapsed;
}
  // Updated Logic to Handle Module and SubModule Permissions
  transformPermissions(data: any[]): void {
    const groupedData: any[] = [];
    data.forEach(item => {
      const existingModule = groupedData.find(m => m.moduleId === item.moduleId);
      // If the Module already exists
      if (existingModule) {
        if (item.subModuleId) {
          existingModule.subModules.push({
            subModuleId: item.subModuleId,
            subModuleName: item.subModuleName,
            subModuleTitle: item.subModuleTitle,
            permissions: item.permissions
          });
        } else {
          // Add Module-level permissions
          existingModule.modulePermissions = item.permissions;
        }
      } else {
        // New Module with SubModule or Module-level permission
        groupedData.push({
          moduleId: item.moduleId,
          moduleName: item.moduleName,
          moduleTitle: item.moduleTitle,
          subModules: item.subModuleId
            ? [
                {
                  subModuleId: item.subModuleId,
                  subModuleName: item.subModuleName,
                  subModuleTitle: item.subModuleTitle,
                  permissions: item.permissions
                }
              ]
            : [],
          modulePermissions: item.subModuleId ? null : item.permissions
        });
      }
    });
    this.permissions = groupedData;
  }
 

  // Method to handle checkbox change
onCheckboxChange(event: Event, module: any, perm: string): void {
  const inputElement = event.target as HTMLInputElement;
  const isChecked = inputElement.checked;

  if (!module.modulePermissions) {
    module.modulePermissions = {}; // Initialize if undefined
  }

  module.modulePermissions[perm] = isChecked;
}


  savePermissions(): void {
    const payload = {
      userId: this.selectedUser,
      permissions: this.permissions.flatMap(module => [
        ...(module.modulePermissions
          ? [
              {
                moduleId: module.moduleId,
                subModuleId: null,
                permissions: module.modulePermissions
              }
            ]
          : []),
        ...module.subModules.map((subModule: { subModuleId: any; permissions: any }) => ({
          moduleId: module.moduleId,
          subModuleId: subModule.subModuleId,
          permissions: subModule.permissions
        }))
      ])
    };
    this.isLoading = true; 
    this.userPermissionService.bulkUpdatePermissions(payload.permissions, payload.userId!).subscribe({
      next: (response) => {
        this.onUserChange();
        this.toastr.success(response.message, 'Success');
        this.isLoading = false; 
      },
      error: (error) => {
        this.toastr.error('Error while saving permissions', 'Error');
        this.isLoading = false; 

      }
    });
  }
}
