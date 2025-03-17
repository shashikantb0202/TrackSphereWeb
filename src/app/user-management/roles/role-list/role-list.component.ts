import { Component, OnInit } from '@angular/core';
import { Role } from '../../../Models/role.model';
import { RoleService } from '../../../Services/role.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { mapApiToRole } from '../../../utils/role.utils';
import { Modal } from 'bootstrap';
import { StatusEnum } from '../../../enums/status.enum';

@Component({
  selector: 'app-role-list',
  imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,NgxPaginationModule],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css'
})
export class RoleListComponent  implements OnInit {
  roles: Role[] = [];
  StatusEnum = StatusEnum; // Expose Enum for HTML usage
  roleForm: FormGroup ; // NEW - Role Form for Validation
  isSubmitted: boolean = false; // NEW - Tracks form submission status
  isInlineSubmitted: boolean = false; // Tracks Inline Edit form submission status

  isLoading: boolean = false; // Loader for List Data
  isSaving: boolean = false; // Loader for Save Button

  // Inline Editing Variables
  editRoleId: number | null = null;
  editableRole: Partial<Role> = {};
  roleModalInstance:  bootstrap.Modal | null = null;

 
  constructor(private roleService: RoleService, private fb: FormBuilder)
   {

    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      status: ['', Validators.required]
    });
   }

  ngOnInit(): void {
    this.loadRoles();
    const modalElement = document.getElementById('roleModal');
    if (modalElement) {
        this.roleModalInstance = new Modal(modalElement); // Initialize Modal
    }
  }

  loadRoles(): void {
    this.isLoading = true; 
    this.roleService.getAllRoles().subscribe((data) => {
      this.roles = data.map(mapApiToRole);
      this.isLoading = false; 
    });
  }

     // Enable Edit Mode
     editRole(role: Role): void {
      this.editRoleId = role.id;
      this.editableRole = { ...role };
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
            debugger
            this.roleModalInstance?.hide();
        this.loadRoles();

      },
      error: (err) => {
        console.error('Error adding role:', err);
        this.isSaving = false; // Loader End
      }
    });
  }

   // Save Role Changes
   saveRole(): void {
    if (this.editableRole.id) {
      this.isSaving = true; // Loader Start // NEW
        this.roleService.updateRole(this.editableRole).subscribe({
            next: () => {
                const index = this.roles.findIndex(r => r.id === this.editableRole.id);
                if (index !== -1) this.roles[index] = { ...this.editableRole } as Role;
                this.isSaving = false;
                this.editRoleId = null;
                this.editableRole = {};
                this.loadRoles();
            },
            error: (err) => {
              console.error('Error saving role:', err);
              this.isSaving = false; // Loader End // NEW
            }
        });
    }
}

// Cancel Edit
cancelEdit(): void {
    this.editRoleId = null;
    this.editableRole = {};
}

   // Open Add Role Modal
   openRoleModal(): void {
    
    this.roleForm.reset();
    this.editableRole = {} as Role;
    this.roleModalInstance?.show();
    
}
}
