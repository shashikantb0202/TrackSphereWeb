import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Role } from '../../../Models/role.model';
import { RoleService } from '../../../Services/role.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { mapApiToRole } from '../../../utils/role.utils';
import { Modal } from 'bootstrap';
import { StatusEnum } from '../../../enums/status.enum';
import { CommonModule } from '@angular/common';
import { enumToStringArray } from '../../../utils/common.utils';

@Component({
  selector: 'app-role-list',
  imports: [CommonModule,
                FormsModule,
                ReactiveFormsModule,NgxDatatableModule],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css'
})
export class RoleListComponent implements OnInit {
  roles: Role[] = [];
  filteredRoles: Role[] = []; // New filtered data array for client-side pagination
  StatusEnum = StatusEnum;

  // Form Management
  roleForm: FormGroup;
  isSubmitted: boolean = false;
  isLoading: boolean = false;
  isSaving: boolean = false;
 statusList: string[] = enumToStringArray(StatusEnum); 
  // Inline Editing
  editRoleId: number | null = null;
  editableRole: Partial<Role> = {};

  // Modal Instance
  roleModalInstance: Modal | null = null;


  // Pagination Variables
  pageSize: number = 5;
  pageNumber: number = 0;
  totalRecords: number = 0;

  constructor(private roleService: RoleService, private fb: FormBuilder) {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      status: ['', Validators.required]
    });
  }
  // Open Add Role Modal
  openRoleModal(): void {
    
    this.roleForm.reset();
    this.editableRole = {} as Role;
    this.roleModalInstance?.show();
    
}
  ngOnInit(): void {
    this.loadRoles();
    const modalElement = document.getElementById('roleModal');
    if (modalElement) {
      this.roleModalInstance = new Modal(modalElement);
    }
  }
// Cancel Edit
cancelEdit(): void {
  this.editRoleId = null;      // Reset edit mode
  this.editableRole = {};      // Clear editable role object
  this.applyClientPagination(); // Refresh data to reset unsaved changes
}
  // Load Roles
  loadRoles(): void {
    this.isLoading = true;

    this.roleService.getAllRoles().subscribe({
      next: (response) => {
        this.roles = response.map(mapApiToRole);
        this.applyClientPagination();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.isLoading = false;
      }
    });
  }

  // Apply Client-side Pagination
  applyClientPagination(): void {
    const start = this.pageNumber * this.pageSize;
    const end = start + this.pageSize;
    this.filteredRoles = [...this.roles].slice(start, end);
    this.totalRecords = this.roles.length;
  }

  // Pagination Logic
  onPage(event: any): void {
    this.pageNumber = event.offset;
    this.applyClientPagination();
  }

  onSort(event: any): void {
    const sortColumn = event.sorts[0].prop as keyof Role;
    const sortDirection = event.sorts[0].dir;
  
    this.filteredRoles.sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];
  
      // Handle undefined or null values gracefully
      if (valueA === undefined || valueA === null) return 1;
      if (valueB === undefined || valueB === null) return -1;
  
      // Handle Date strings safely
      if (sortColumn === 'createdOn' && typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc'
          ? new Date(valueA).getTime() - new Date(valueB).getTime()
          : new Date(valueB).getTime() - new Date(valueA).getTime();
      }
  
      // Handle numeric sorting
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }
  
      // Handle string sorting
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
  
      return 0; // Default case for unhandled data types
    });
  }
  
  
  // Edit Role
  editRole(role: Role): void {
    this.editRoleId = role.id;
    this.editableRole = { ...role };
  }

  // Save Role
  saveRole(): void {
    if (!this.editableRole.id) return;

    this.isSaving = true;
    this.roleService.updateRole(this.editableRole).subscribe({
      next: () => {
        const index = this.roles.findIndex(r => r.id === this.editableRole.id);
        if (index !== -1) this.roles[index] = { ...this.editableRole } as Role;
        this.isSaving = false;
        this.editRoleId = null;
        this.loadRoles();
      },
      error: (err) => {
        console.error('Error saving role:', err);
        this.isSaving = false;
      }
    });
  }

  // Save New Role (Add Role via Modal)
  saveNewRole(): void {  // NEW FUNCTION
    this.isSubmitted = true; // Form submission tracking // NEW
    if (this.roleForm.invalid) return; // Prevent submission if invalid // NEW
    this.isSaving = true; // Loader Start
    this.roleService.addRole(this.roleForm.value).subscribe({
      next: (newRole) => {
        this.isSaving = false;
        this.editRoleId = null;
        this.editableRole = {};
            // Close Modal Programmatically
            this.roleModalInstance?.hide();
        this.loadRoles();
      },
      error: (err) => {
        console.error('Error adding role:', err);
        this.isSaving = false; // Loader End
      }
    });
  }
  
  // TrackBy for Improved Performance
  trackById(index: number, role: Role): number {
    return role.id;
  }
}
