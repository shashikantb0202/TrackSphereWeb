import { Component, OnInit, OnDestroy } from '@angular/core';
import { LeaveBalance } from '../../../Models/leave-balance.model';
import { LeaveBalanceService } from '../../../Services/leave-balance.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { UserBasicInfo } from '../../../Models/user.model';
import { UserService } from '../../../Services/user.service';
import { LeaveType } from '../../../Models/leave-type.model';
import { LeaveTypeService } from '../../../Services/leave-type.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-leave-balance-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxDatatableModule],
  providers: [DatePipe],
  templateUrl: './leave-balance-list.component.html',
  styleUrl: './leave-balance-list.component.css',
})
export class LeaveBalanceListComponent implements OnInit {
  private destroy$ = new Subject<void>();
  leaveBalances: LeaveBalance[] = [];
  selectedYear: number = new Date().getFullYear();
  years: number[] = [];
  selectedUserId: number | null = null;
  selectedLeaveTypeId: number | null = null;
  userList: UserBasicInfo[] = [];
  leaveTypeList: LeaveType[] = [];
  isLoading: boolean = false;

  // Pagination Variables
  pageSize: number = 10;
  pageNumber: number = 0;
  totalRecords: number = 0;
  sortColumn: string = '';
  sortDirection: string = '';

  constructor(
    private leaveBalanceService: LeaveBalanceService,
    private userService: UserService,
    private leaveTypeService: LeaveTypeService
  ) {
    // Generate years array (current year ± 5 years)
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      this.years.push(i);
    }
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadLeaveTypes();
    this.loadLeaveBalances();
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

  loadLeaveTypes(): void {
    this.leaveTypeService.getAllLeaveTypes().subscribe({
      next: (leaveTypes: LeaveType[]) => {
        this.leaveTypeList = leaveTypes;
      },
      error: (error: any) => {
        console.error('Error loading leave types:', error);
      },
    });
  }

  loadLeaveBalances(): void {
    this.isLoading = true;
    const params = {
      year: this.selectedYear.toString(),
      userId: this.selectedUserId?.toString() || '',
      leaveTypeId: this.selectedLeaveTypeId?.toString() || '',
      pageSize: this.pageSize.toString(),
      page: (this.pageNumber + 1).toString(),
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
    };

    this.leaveBalanceService.getLeaveBalancesWithFilter(params).subscribe({
      next: (response) => {
        this.leaveBalances = response.data.data;
        this.totalRecords = response.data.totalRecords;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.leaveBalances = [];
        this.totalRecords = 0;
      },
    });
  }

  onPage(event: any): void {
    this.pageNumber = event.offset;
    this.pageSize = event.limit;
    this.loadLeaveBalances();
  }

  onSort(event: any): void {
    this.sortColumn = event.sorts[0].prop;
    this.sortDirection = event.sorts[0].dir;
    this.loadLeaveBalances();
  }

  onYearChange(): void {
    this.pageNumber = 0;
    this.loadLeaveBalances();
  }

  onUserChange(): void {
    this.pageNumber = 0;
    this.loadLeaveBalances();
  }

  onLeaveTypeChange(): void {
    this.pageNumber = 0;
    this.loadLeaveBalances();
  }
}
