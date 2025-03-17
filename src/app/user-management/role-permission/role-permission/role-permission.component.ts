

import { Component, OnInit } from '@angular/core';
import { RolePermissionService } from '../../../Services/role-permission.service';
import { mapApiToRole } from '../../../utils/role.utils';
import { Role } from '../../../Models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';

interface PermissionUpdate {
  id: number;
  status: boolean;
}

@Component({
  selector: 'app-role-permission',
   imports: [CommonModule,
              FormsModule,
              ReactiveFormsModule],
  templateUrl: './role-permission.component.html',
  styleUrls: ['./role-permission.component.css']
})
export class RolePermissionComponent implements OnInit {
  
  roles: any[] = [];
  selectedRole: number | any;
  permissions: any[] = [];
  permissionHeaders: string[] = ['View', 'Add', 'Update', 'Delete', 'Download'];  // Dynamic headers

  constructor(
    private rolePermissionService: RolePermissionService,
    private toastr: ToastrService
  ) {}

  
  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.rolePermissionService.getRoles().subscribe((data) => {
      this.roles = data.data;
    });
  }

  onRoleChange(): void {
    if (this.selectedRole) {
      this.rolePermissionService.getRolePermissions(this.selectedRole).subscribe((response) => {
        this.transformPermissions(response.data);
      });
    }
  }

  transformPermissions(data: any[]): void {
    const groupedData: any[] = [];

    data.forEach(item => {
      const existingModule = groupedData.find(m => m.moduleId === item.moduleId);

      if (existingModule) {
        existingModule.subModules.push({
          subModuleId: item.subModuleId,
          subModuleName: item.subModuleName,
          subModuleTitle: item.subModuleTitle,
          permissions: item.permissions
        });
      } else {
        groupedData.push({
          moduleId: item.moduleId,
          moduleName: item.moduleName,
          moduleTitle: item.moduleTitle,
          subModules: [
            {
              subModuleId: item.subModuleId,
              subModuleName: item.subModuleName,
              permissions: item.permissions
            }
          ]
        });
      }
    });

    this.permissions = groupedData;
  }

  savePermissions(): void {
    const payload = {
      roleId: this.selectedRole,
      permissions: this.permissions.flatMap(module =>
        module.subModules.map((subModule: { subModuleId: any; permissions: any; }) => ({
          moduleId: module.moduleId,
          subModuleId: subModule.subModuleId,
          permissions: subModule.permissions
        }))
      )
    };

    this.rolePermissionService.bulkUpdatePermissions(payload.permissions,payload.roleId).subscribe(
      {
        next: (response) => {
          this.onRoleChange();
          this.toastr.success(response.message, 'Success');
        },
        error: (error) => {
         // this.toastr.error('', 'Error');  
        }
      }
    );
  }
}