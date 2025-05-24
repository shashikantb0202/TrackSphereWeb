import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { UserBasicInfo } from '../../../Models/user.model';
import { UserService } from '../../../Services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { SalaryStructure } from '../../../Models/salary-structure.model';
import { SalaryManagementService } from '../../../Services/salary-management.service';

@Component({
  selector: 'app-user-salary-structure-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgxDatatableModule,
    DateFormatPipe,
  ],
  providers: [DatePipe],
  templateUrl: './user-salary-structure-list.component.html',
  styleUrl: './user-salary-structure-list.component.css',
})
export class UserSalaryStructureListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  salaryStructures: SalaryStructure[] = [];
  selectedYear: number = new Date().getFullYear();
  years: number[] = [];
  selectedUserId: string | null = null;
  userList: UserBasicInfo[] = [];
  isLoading: boolean = false;

  // Pagination Variables
  pageSize: number = 10;
  pageNumber: number = 0;
  totalRecords: number = 0;
  sortColumn: string = '';
  sortDirection: string = '';

  constructor(
    private userService: UserService,
    private salaryService: SalaryManagementService,
    private toastr: ToastrService,
    private router: Router
  ) {
    // Generate years array (current year ± 5 years)
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      this.years.push(i);
    }
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadSalaryStructures();
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
        next: (users: UserBasicInfo[]) => {
          this.userList = users;
        },
        error: (error: any) => {
          console.error('Error loading users:', error);
          this.toastr.error('Failed to load users');
        },
      });
  }

  loadSalaryStructures(): void {
    this.isLoading = true;
    const params = {
      userId: this.selectedUserId || '',
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
      page: (this.pageNumber + 1).toString(),
      pageSize: this.pageSize.toString(),
    };

    this.salaryService.getAllSalaryStructuresWithFilter(params).subscribe({
      next: (response) => {
        this.salaryStructures = response.data.data;
        this.totalRecords = response.data.totalRecords;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.salaryStructures = [];
        this.totalRecords = 0;
        this.toastr.error(
          error.error.message || 'Failed to load salary structures'
        );
      },
    });
  }

  onPage(event: any): void {
    this.pageNumber = event.offset;
    this.pageSize = event.limit;
    this.loadSalaryStructures();
  }

  onSort(event: any): void {
    this.sortColumn = event.sorts[0].prop;
    this.sortDirection = event.sorts[0].dir;
    this.loadSalaryStructures();
  }

  onYearChange(): void {
    this.pageNumber = 0;
    this.loadSalaryStructures();
  }

  onUserChange(): void {
    this.pageNumber = 0;
    this.loadSalaryStructures();
  }

  navigateToAddSalaryStructure(): void {
    this.router.navigate(['main/salary-management/salary-structures/add']);
  }
}
