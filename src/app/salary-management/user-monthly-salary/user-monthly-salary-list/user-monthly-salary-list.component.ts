import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UserService } from '../../../Services/user.service';
import { SalaryManagementService } from '../../../Services/salary-management.service';
import { UserBasicInfo } from '../../../Models/user.model';
import { MonthlySalary } from '../../../Models/monthly-salary.model';
import { MonthEnum } from '../../../enums/month.enum';
import { SalaryStatus } from '../../../enums/salary-status.enum';

@Component({
  selector: 'app-user-monthly-salary-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgxDatatableModule],
  templateUrl: './user-monthly-salary-list.component.html',
  styleUrls: ['./user-monthly-salary-list.component.css'],
})
export class UserMonthlySalaryListComponent implements OnInit {
  monthlySalaries: MonthlySalary[] = [];
  userList: UserBasicInfo[] = [];
  isLoading = false;
  totalRecords = 0;
  pageSize = 10;
  currentPage = 0;
  sortColumn = 'salaryMonth';
  sortDirection = 'desc';

  // Filter properties
  selectedUserId: number | null = null;
  selectedYear: number = new Date().getFullYear();
  selectedMonth: string = '';
  selectedStatus: SalaryStatus | null = null;

  // Available years (current year and 2 years back)
  years: number[] = [];
  months = Object.entries(MonthEnum)
    .filter(([key, value]) => typeof value === 'string')
    .map(([key, value]) => ({
      value: value as string,
      label: key,
    }));
  salaryStatuses = Object.values(SalaryStatus);

  constructor(
    private router: Router,
    private userService: UserService,
    private salaryManagementService: SalaryManagementService
  ) {
    // Initialize years array
    const currentYear = new Date().getFullYear();
    this.years = [
      currentYear - 5,
      currentYear - 4,
      currentYear - 3,
      currentYear - 2,
      currentYear - 1,
      currentYear,
    ];
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadMonthlySalaries();
  }

  loadUsers(): void {
    this.userService.getAllUser().subscribe({
      next: (users: UserBasicInfo[]) => {
        this.userList = users;
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
      },
    });
  }

  loadMonthlySalaries(): void {
    this.isLoading = true;
    const params = {
      userId: this.selectedUserId?.toString() || '',
      year: this.selectedYear.toString(),
      month: this.selectedMonth.toString(),
      salaryStatus: this.selectedStatus?.toString() || '',
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
      page: (this.currentPage + 1).toString(),
      pageSize: this.pageSize.toString(),
    };

    this.salaryManagementService
      .getAllMonthlySalariesWithFilter(params)
      .subscribe({
        next: (response: any) => {
          this.monthlySalaries = response.data.data;
          this.totalRecords = response.data.totalRecords;
          this.isLoading = false;
        },
        error: (error: any) => {
          this.monthlySalaries = [];
          this.totalRecords = 0;

          console.error('Error loading monthly salaries:', error);
          this.isLoading = false;
        },
      });
  }

  onPage(event: any): void {
    this.currentPage = event.offset;
    this.pageSize = event.limit;
    this.loadMonthlySalaries();
  }

  onSort(event: any): void {
    this.sortColumn = event.sorts[0].prop;
    this.sortDirection = event.sorts[0].dir;
    this.loadMonthlySalaries();
  }

  onUserChange(): void {
    this.currentPage = 0;
    this.loadMonthlySalaries();
  }

  onYearChange(): void {
    this.currentPage = 0;
    this.loadMonthlySalaries();
  }

  onMonthChange(): void {
    this.currentPage = 0;
    this.loadMonthlySalaries();
  }

  onStatusChange(): void {
    this.currentPage = 0;
    this.loadMonthlySalaries();
  }

  navigateToAddMonthlySalary(): void {
    this.router.navigate(['/main/salary-management/monthly-salaries/add']);
  }
}
