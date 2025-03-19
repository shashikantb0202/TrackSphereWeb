import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../Services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AddUser, User,Location, Department, Designation, Role } from '../../../Models/user.model';
import { CommonModule } from '@angular/common';
import { DropdownService } from '../../../Services/dropdown.service';
import { RoleService } from '../../../Services/role.service';
import { ToastrService } from 'ngx-toastr';
import { getDirtyValues } from '../../../utils/form.utils';

@Component({
  selector: 'app-user-form-component',
 imports: [CommonModule,
     FormsModule,
      ReactiveFormsModule],
  templateUrl: './user-form-component.html',
  styleUrl: './user-form-component.css'
})
export class UserFormComponent implements OnInit {

  userForm!: FormGroup;
  isEditMode = false;
  userId: number | null = null;
  isSubmitted: boolean=false;

countries: Location[] = [];
states: Location[] = [];
cities: Location[] = [];
departments: Department[] = [];
designations: Designation[] = [];
roles: Role[] = [];  // Assuming roles are fetched separately
isLoading: boolean=false;
  constructor(
      private fb: FormBuilder,
      private userService: UserService,
      private route: ActivatedRoute,
      public router: Router,
      private dropdownService: DropdownService,
      private roleService: RoleService,
      private toastr: ToastrService

  ) {}

  ngOnInit(): void {
      this.initForm();
      this.checkEditMode();
      this.loadDropdownData();
  }
  loadDropdownData(): void {
    this.dropdownService.getCountries().subscribe(data => this.countries = data);
    this.dropdownService.getDepartments().subscribe(data => this.departments = data);
    this.dropdownService.getDesignations().subscribe(data => this.designations = data);
    this.roleService.getAllRoles().subscribe(data => this.roles = data);
  }

  private initForm(): void {
      this.userForm = this.fb.group({
        name: ['', Validators.required],
          lastName: ['', Validators.required],
          password: ['', [Validators.required, Validators.minLength(8)]],
          confirmPassword: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          workemail: ['', [Validators.required, Validators.email]],
          username: ['', Validators.required],
          contactNo: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
          empCode: ['', Validators.required],
          designationId: [null, Validators.required],
          departmentId: [null, Validators.required],
          addressLine1: ['', Validators.required],
          addressLine2: [''],
          landmark: [''],
          countryId: [null, Validators.required],
          stateId: [null, Validators.required],
          cityId: [null, Validators.required],
          roleId: [null, Validators.required],
      }, { validator: this.passwordMatchValidator });
  }

  private passwordMatchValidator(formGroup: FormGroup): void {
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;

      if (password !== confirmPassword) {
          formGroup.get('confirmPassword')?.setErrors({ mismatch: true });
      } else {
          formGroup.get('confirmPassword')?.setErrors(null);
      }
  }

  private checkEditMode(): void {
      this.userId = Number(this.route.snapshot.paramMap.get('id'));
      this.isEditMode = !!this.userId;

      if (this.isEditMode) {
        this.isLoading=true;
          this.userService.getUserById(this.userId).subscribe(    
            {
            next: (userData) => {
            this.patchFormData(userData);
              this.userForm.get('password')?.clearValidators();
              this.userForm.get('confirmPassword')?.clearValidators();
              this.onCountryChange();
              this.onStateChange();
              this.isLoading=false;
                },
                error: (error) => {
                  this.isLoading = false; 
                }
              });
      }
  }
  patchFormData(userData: User): void {
    this.isEditMode = true;

    this.userForm.patchValue({
        id: userData.id,
        name: userData.name,
        lastName: userData.lastName,
        email: userData.email,
        workemail: userData.workEmail,
        username: userData.username,
        contactNo: userData.contactNo,
        empCode: userData.empCode,
        designationId: userData.designation?.id,
        departmentId: userData.department?.id,
        addressLine1: userData?.addressLine1 || '',  // Assuming location data includes address
        addressLine2: userData?.addressLine2 || '',
        landmark: userData?.landmark || '',
        countryId: userData.country?.id,
        stateId: userData.state?.id,
        cityId: userData.city?.id,
        roleId: userData.role?.id
    });
}
  
  onSubmit(): void {
    this.isSubmitted = true;

    if (this.userForm.invalid) return;

    const userData: AddUser = this.userForm.value;
    this.isLoading=true;
    if (this.isEditMode) {
        const updatedData = getDirtyValues(this.userForm);

        if (Object.keys(updatedData).length === 0) {
            this.isLoading = false;
            this.toastr.info('No changes detected.');
            return;
        }
        debugger
        this.userService.updateUser(this.userId!, updatedData).subscribe( {
                next: (response) => {
                    this.toastr.success(response.message);
                    this.isLoading=false;
                    this.router.navigate(['main/user-management/user-list']);
                },
                error: (error) => {
                  this.isLoading = false; 
                  this.toastr.error(error.message);
                }
              });
          }
     else {
        this.userService.addUser(userData)   
        .subscribe( {
            next: (response) => {
                this.toastr.success(response.message);
                this.isLoading=false;
                this.router.navigate(['main/user-management/user-list']);
            },
            error: (error) => {
              this.isLoading = false; 
              this.toastr.error(error.message);
            }
          });
    }
}


 /** Load States on Country Change */
 onCountryChange(): void {
    const countryId = this.userForm.get('countryId')?.value;
    if (countryId) {
      this.dropdownService.getStatesByCountry(countryId).subscribe(   
        {
            next: (response) => {
                this.states = response;
                this.cities = []; // Reset cities when country changes
              this.isLoading = false; 
            },
            error: (error) => {
              this.isLoading = false; 
      
            }
          }  
      );
    }
  }

  /** Load Cities on State Change */
  onStateChange(): void {
    const stateId = this.userForm.get('stateId')?.value;
    if (stateId) {
      this.dropdownService.getCitiesByState(stateId).subscribe(data => this.cities = data);
    }
  }


}
