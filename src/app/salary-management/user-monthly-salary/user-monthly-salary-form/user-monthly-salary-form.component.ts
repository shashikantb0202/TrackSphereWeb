import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SalaryManagementService } from '../../../Services/salary-management.service';
import { UserService } from '../../../Services/user.service';
import { User } from '../../../Models/user.model';
import {
  MonthlySalary,
  SalaryDeduction,
} from '../../../Models/monthly-salary.model';
import { SalaryStatus } from '../../../enums/salary-status.enum';
import { ToastrService } from 'ngx-toastr';
import { PaymentMethodEnum } from '../../../enums/payment-method.enum';
import { MonthEnum } from '../../../enums/month.enum';
import { DeductionTypeEnum } from '../../../enums/deduction-type.enum';
@Component({
  selector: 'app-user-monthly-salary-form',
  templateUrl: './user-monthly-salary-form.component.html',
  styleUrls: ['./user-monthly-salary-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class UserMonthlySalaryFormComponent implements OnInit {
  monthlySalaryForm: FormGroup;
  users: User[] = [];
  isEditMode = false;
  salaryId: number | null = null;
  loading = false;
  submitting = false;
  salaryStatuses = Object.values(SalaryStatus);
  months = Object.values(MonthEnum).filter(
    (value) => typeof value === 'number'
  );
  Month = MonthEnum;
  paymentMethods = Object.values(PaymentMethodEnum);
  deductionTypes = Object.values(DeductionTypeEnum).filter(
    (value) => typeof value === 'number'
  );
  DeductionType = DeductionTypeEnum;
  currentYear = new Date().getFullYear();
  years: number[] = [];

  constructor(
    private fb: FormBuilder,
    private salaryService: SalaryManagementService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.monthlySalaryForm = this.fb.group({
      userId: ['', Validators.required],
      year: [
        this.currentYear,
        [Validators.required, Validators.min(2000), Validators.max(2100)],
      ],
      salaryMonth: [new Date().getMonth() + 1, Validators.required],
      basicSalary: [0, [Validators.required, Validators.min(0)]],
      hra: [0, [Validators.required, Validators.min(0)]],
      allowances: [0, [Validators.required, Validators.min(0)]],
      deductions: this.fb.array([]),
      totalDeductions: [
        { value: 0, disabled: true },
        [Validators.required, Validators.min(0)],
      ],
      netSalary: [0, [Validators.required, Validators.min(0)]],
      status: [SalaryStatus.Pending, Validators.required],
      paymentMethod: [null],
      paymentDate: [null],
      transactionReference: [''],
      paymentRemarks: [''],
      chequeNumber: [''],
      upiReference: [''],
    });

    // Generate years array (current year and next 4 years)
    for (let i = 0; i < 5; i++) {
      this.years.push(this.currentYear + i);
    }
  }

  get deductionsArray() {
    return this.monthlySalaryForm.get('deductions') as FormArray;
  }

  addDeduction() {
    const deductionForm = this.fb.group({
      deductionType: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      description: [''],
    });

    this.deductionsArray.push(deductionForm);
  }

  removeDeduction(index: number) {
    this.deductionsArray.removeAt(index);
    this.calculateNetSalary();
  }

  ngOnInit(): void {
    this.loadUsers();
    this.salaryId = this.route.snapshot.params['id'];
    if (this.salaryId) {
      this.isEditMode = true;
      this.loadMonthlySalary();
    } else {
      // Only subscribe to userId changes in create mode
      this.monthlySalaryForm.get('userId')?.valueChanges.subscribe((userId) => {
        if (userId) {
          this.loadSalaryStructure(userId);
        }
      });
    }

    // Subscribe to form value changes to calculate net salary
    this.monthlySalaryForm.valueChanges.subscribe(() => {
      this.calculateNetSalary();
    });
  }

  loadUsers(): void {
    this.userService.getAllUser().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        this.toastr.error('Failed to load users');
        console.error('Error loading users:', error);
      },
    });
  }

  loadMonthlySalary(): void {
    if (!this.salaryId) return;

    this.loading = true;
    this.salaryService.getMonthlySalaryById(this.salaryId).subscribe({
      next: (salary) => {
        // Clear existing deductions
        while (this.deductionsArray.length) {
          this.deductionsArray.removeAt(0);
        }

        // Add deductions from the response
        if (salary.data.deductions && Array.isArray(salary.data.deductions)) {
          salary.data.deductions.forEach((deduction) => {
            this.deductionsArray.push(
              this.fb.group({
                deductionType: [deduction.deductionType, Validators.required],
                amount: [
                  deduction.amount,
                  [Validators.required, Validators.min(0)],
                ],
                description: [deduction.description],
              })
            );
          });
        }

        // Disable user field in edit mode
        this.monthlySalaryForm.get('userId')?.disable();

        this.monthlySalaryForm.patchValue({
          userId: salary.data.user.id,
          year: salary.data.year,
          salaryMonth: salary.data.salaryMonth,
          basicSalary: salary.data.basicSalary,
          hra: salary.data.hra,
          allowances: salary.data.allowances,
          netSalary: salary.data.netSalary,
          totalDeductions: salary.data.totalDeductions,
          status: salary.data.salaryStatus,
          paymentMethod: salary.data.paymentMethod,
          paymentDate: salary.data.paymentDate,
          transactionReference: salary.data.transactionReference,
          paymentRemarks: salary.data.paymentRemarks,
          chequeNumber: salary.data.chequeNumber,
          upiReference: salary.data.upiReference,
        });
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error('Error loading monthly salary');
        this.loading = false;
      },
    });
  }

  loadSalaryStructure(userId: number): void {
    this.loading = true;
    this.salaryService.getSalaryStructureByUserId(userId).subscribe({
      next: (response) => {
        const structure = response.data;
        if (structure) {
          // Update basic salary, HRA, and allowances
          this.monthlySalaryForm.patchValue({
            basicSalary: structure.basicSalary,
            hra: structure.hra,
            allowances: structure.allowances,
          });

          // Clear existing deductions
          while (this.deductionsArray.length) {
            this.deductionsArray.removeAt(0);
          }

          // Add PF deduction if PF percentage is set
          if (structure.pfPercent > 0) {
            const pfAmount =
              (structure.basicSalary * structure.pfPercent) / 100;
            this.deductionsArray.push(
              this.fb.group({
                deductionType: [DeductionTypeEnum.PF, Validators.required],
                amount: [pfAmount, [Validators.required, Validators.min(0)]],
                description: ['PF Deduction'],
              })
            );
          }

          // Add other deductions if any
          if (structure.deductions > 0) {
            this.deductionsArray.push(
              this.fb.group({
                deductionType: [DeductionTypeEnum.Other, Validators.required],
                amount: [
                  structure.deductions,
                  [Validators.required, Validators.min(0)],
                ],
                description: ['Other Deductions'],
              })
            );
          }

          // Calculate net salary
          this.calculateNetSalary();
        } else {
          // Reset form if no structure found
          this.resetSalaryFields();
        }
        this.loading = false;
      },
      error: (error) => {
        // Reset form on error
        this.resetSalaryFields();
        this.loading = false;
      },
    });
  }

  private resetSalaryFields(): void {
    // Reset salary-related fields to default values
    this.monthlySalaryForm.patchValue({
      basicSalary: 0,
      hra: 0,
      allowances: 0,
      totalDeductions: 0,
      netSalary: 0,
    });

    // Clear all deductions
    while (this.deductionsArray.length) {
      this.deductionsArray.removeAt(0);
    }

    // Show error message
    this.toastr.error('No salary structure found for this employee');
  }

  calculateNetSalary(): void {
    const basicSalary = this.monthlySalaryForm.get('basicSalary')?.value || 0;
    const hra = this.monthlySalaryForm.get('hra')?.value || 0;
    const allowances = this.monthlySalaryForm.get('allowances')?.value || 0;

    // Calculate total deductions from the deductions array
    const totalDeductions = this.deductionsArray.controls.reduce(
      (total, control) => {
        return total + (control.get('amount')?.value || 0);
      },
      0
    );

    // Update totalDeductions and netSalary
    this.monthlySalaryForm.patchValue(
      {
        totalDeductions,
        netSalary: basicSalary + hra + allowances - totalDeductions,
      },
      { emitEvent: false }
    );
  }

  onSubmit(): void {
    if (this.monthlySalaryForm.invalid) {
      this.toastr.error('Please fill all required fields correctly');
      return;
    }

    this.submitting = true;
    const formData = this.monthlySalaryForm.value;

    if (this.isEditMode && this.salaryId) {
      const updatedFields: { [key: string]: any } = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          updatedFields[key] = formData[key];
        }
      });

      this.salaryService
        .updateMonthlySalary(this.salaryId, updatedFields)
        .subscribe({
          next: () => {
            this.toastr.success('Monthly salary updated successfully');
            this.router.navigate(['main/salary-management/monthly-salaries']);
          },
          error: (error) => {
            this.toastr.error('Error updating monthly salary');
            this.submitting = false;
          },
        });
    } else {
      this.salaryService.createMonthlySalary(formData).subscribe({
        next: () => {
          this.toastr.success('Monthly salary created successfully');
          this.router.navigate(['main/salary-management/monthly-salaries']);
        },
        error: (error) => {
          this.toastr.error('Error creating monthly salary');
          this.submitting = false;
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['main/salary-management/monthly-salaries']);
  }
}
