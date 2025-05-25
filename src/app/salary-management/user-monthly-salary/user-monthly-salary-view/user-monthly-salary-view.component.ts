import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonthlySalary } from '../../../Models/monthly-salary.model';
import { SalaryManagementService } from '../../../Services/salary-management.service';
@Component({
  selector: 'app-user-monthly-salary-view',
  templateUrl: './user-monthly-salary-view.component.html',
  styleUrls: ['./user-monthly-salary-view.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class UserMonthlySalaryViewComponent implements OnInit {
  monthlySalary: MonthlySalary | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private salaryService: SalaryManagementService
  ) {}

  ngOnInit(): void {
    this.loadMonthlySalary();
  }

  loadMonthlySalary(): void {
    const salaryId = this.route.snapshot.paramMap.get('id');
    if (!salaryId) {
      this.error = 'Salary ID is required';
      return;
    }

    this.isLoading = true;
    this.salaryService.getMonthlySalaryById(parseInt(salaryId)).subscribe({
      next: (data) => {
        this.monthlySalary = data.data;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load salary details';
        this.isLoading = false;
        console.error('Error loading salary:', error);
      },
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Paid':
        return 'bg-success';
      case 'Pending':
        return 'bg-warning';
      case 'Processing':
        return 'bg-info';
      case 'Failed':
        return 'bg-danger';
      case 'Cancelled':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  }

  navigateBack(): void {
    this.router.navigate(['/main/salary-management/monthly-salaries']);
  }

  navigateToEdit(): void {
    if (this.monthlySalary) {
      this.router.navigate([
        '/main/salary-management/monthly-salaries/edit',
        this.monthlySalary.id,
      ]);
    }
  }
}
