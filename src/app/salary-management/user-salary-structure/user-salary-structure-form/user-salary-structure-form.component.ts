import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { SalaryManagementService } from '../../../Services/salary-management.service';
import { UserService } from '../../../Services/user.service';
import { UserBasicInfo } from '../../../Models/user.model';
import { SalaryStructure } from '../../../Models/salary-structure.model';
import { StatusEnum } from '../../../enums/status.enum';
import { getDirtyValues } from '../../../utils/form.utils';

@Component({
  selector: 'app-user-salary-structure-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-salary-structure-form.component.html',
  styleUrls: ['./user-salary-structure-form.component.css'],
})
export class UserSalaryStructureFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  salaryStructureForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  isSubmitted = false;
  users: UserBasicInfo[] = [];
  salaryStructureId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private salaryService: SalaryManagementService,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.salaryStructureForm = this.fb.group({
      userId: ['', Validators.required],
      basicSalary: ['', [Validators.required, Validators.min(0)]],
      hra: ['', [Validators.required, Validators.min(0)]],
      allowances: ['', [Validators.required, Validators.min(0)]],
      deductions: ['', [Validators.required, Validators.min(0)]],
      effectiveFrom: ['', Validators.required],
      netSalary: [0, [Validators.required, Validators.min(1)]],
    });

    // Subscribe to value changes to update net salary
    this.salaryStructureForm.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(100), distinctUntilChanged())
      .subscribe(() => {
        const netSalary = this.calculateNetSalary();
        this.salaryStructureForm
          .get('netSalary')
          ?.setValue(netSalary, { emitEvent: false });
      });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.salaryStructureId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.salaryStructureId) {
      this.isEditMode = true;
      this.loadSalaryStructure();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers(): void {
    this.userService
      .getAllUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.users = users;
        },
        error: (error) => {
          this.toastr.error('Failed to load users');
          console.error('Error loading users:', error);
        },
      });
  }

  loadSalaryStructure(): void {
    if (!this.salaryStructureId) return;

    this.isLoading = true;
    this.salaryService
      .getSalaryStructureById(this.salaryStructureId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const salaryStructure = response.data;
          // Format the date to YYYY-MM-DD for the date input
          const effectiveFromDate = new Date(salaryStructure.effectiveFrom);
          const formattedDate = effectiveFromDate.toISOString().split('T')[0];

          this.salaryStructureForm.patchValue({
            userId: salaryStructure.user!.id,
            basicSalary: salaryStructure.basicSalary,
            hra: salaryStructure.hra,
            allowances: salaryStructure.allowances,
            deductions: salaryStructure.deductions,
            effectiveFrom: formattedDate,
          });
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.toastr.error('Failed to load salary structure');
          console.error('Error loading salary structure:', error);
        },
      });
  }

  calculateNetSalary(): number {
    const basicSalary = this.salaryStructureForm.get('basicSalary')?.value || 0;
    const hra = this.salaryStructureForm.get('hra')?.value || 0;
    const allowances = this.salaryStructureForm.get('allowances')?.value || 0;
    const deductions = this.salaryStructureForm.get('deductions')?.value || 0;
    const netSalary = basicSalary + hra + allowances - deductions;

    // Update form validation
    if (netSalary < 0) {
      this.salaryStructureForm.get('netSalary')?.setErrors({ min: true });
    } else {
      this.salaryStructureForm.get('netSalary')?.setErrors(null);
    }

    return netSalary;
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.salaryStructureForm.invalid) return;

    this.isLoading = true;
    const formData = {
      ...this.salaryStructureForm.getRawValue(),
      netSalary: this.calculateNetSalary(),
    };

    if (this.isEditMode) {
      const updatedData = getDirtyValues(this.salaryStructureForm);
      updatedData.netSalary = this.calculateNetSalary();

      if (Object.keys(updatedData).length === 0) {
        this.isLoading = false;
        this.toastr.info('No changes detected.');
        return;
      }

      this.salaryService
        .updateSalaryStructure(this.salaryStructureId!, updatedData)
        .subscribe({
          next: (response) => {
            this.toastr.success('Salary structure updated successfully');
            this.isLoading = false;
            this.router.navigate([
              '/main/salary-management/salary-structures/view',
              response.data.id,
            ]);
          },
          error: (error: any) => {
            this.isLoading = false;
            this.toastr.error(
              error.error?.message || 'Failed to update salary structure'
            );
          },
        });
    } else {
      this.salaryService.createSalaryStructure(formData).subscribe({
        next: (response) => {
          this.toastr.success('Salary structure created successfully');
          this.isLoading = false;
          this.router.navigate([
            '/main/salary-management/salary-structures/view',
            response.data.id,
          ]);
        },
        error: (error: any) => {
          this.isLoading = false;
          this.toastr.error(
            error.error?.message || 'Failed to create salary structure'
          );
        },
      });
    }
  }

  navigateToList(): void {
    this.router.navigate(['main/salary-management/salary-structures']);
  }
}
