import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { UserBasicInfo } from '../../../Models/user.model';
import { UserService } from '../../../Services/user.service';
import { LeaveType } from '../../../Models/leave-type.model';
import { LeaveTypeService } from '../../../Services/leave-type.service';
import { UserLeaveService } from '../../../Services/user-leave.service';
import { UserLeave } from '../../../Models/user-leave.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LeaveStatus } from '../../../enums/leave-status.enum';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-leave-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxDatatableModule, DateFormatPipe],
  providers: [DatePipe],
  templateUrl: './user-leave-list.component.html',
  styleUrl: './user-leave-list.component.css',
})
export class UserLeaveListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  userLeaves: UserLeave[] = [];
  selectedYear: number = new Date().getFullYear();
  years: number[] = [];
  selectedUserId: number | null = null;
  selectedLeaveTypeId: number | null = null;
  selectedStatus: LeaveStatus | null = null;
  userList: UserBasicInfo[] = [];
  leaveTypeList: LeaveType[] = [];
  isLoading: boolean = false;

  // Pagination Variables
  pageSize: number = 10;
  pageNumber: number = 0;
  totalRecords: number = 0;
  sortColumn: string = '';
  sortDirection: string = '';

  // Inline Editing
  editingRow: number | null = null;
  editedLeave: Partial<UserLeave> = {};

  // Status Options
  statusOptions = Object.values(LeaveStatus).filter(
    (value) => typeof value === 'string'
  );
  LeaveStatus = LeaveStatus; // Make enum available in template

  constructor(
    private userService: UserService,
    private leaveTypeService: LeaveTypeService,
    private userLeaveService: UserLeaveService,
    private toastr: ToastrService
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
    this.loadUserLeaves();
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

  loadLeaveTypes(): void {
    this.leaveTypeService
      .getAllLeaveTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (leaveTypes: LeaveType[]) => {
          this.leaveTypeList = leaveTypes;
        },
        error: (error: any) => {
          console.error('Error loading leave types:', error);
          this.toastr.error('Failed to load leave types');
        },
      });
  }

  loadUserLeaves(): void {
    this.isLoading = true;
    const params = {
      year: this.selectedYear.toString(),
      userId: this.selectedUserId?.toString() || '',
      leaveTypeId: this.selectedLeaveTypeId?.toString() || '',
      LeaveStatus: this.selectedStatus?.toString() || '',
      pageSize: this.pageSize.toString(),
      page: (this.pageNumber + 1).toString(),
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
    };

    this.userLeaveService.getUserLeavesWithFilter(params).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        this.userLeaves = response.data.data;
        console.log('User Leaves:', this.userLeaves);
        this.totalRecords = response.data.totalRecords;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.userLeaves = [];
        this.totalRecords = 0;
        this.toastr.error(error.error.message);
      },
    });
  }

  onPage(event: any): void {
    this.pageNumber = event.offset;
    this.pageSize = event.limit;
    this.loadUserLeaves();
  }

  onSort(event: any): void {
    this.sortColumn = event.sorts[0].prop;
    this.sortDirection = event.sorts[0].dir;
    this.loadUserLeaves();
  }

  onYearChange(): void {
    this.pageNumber = 0;
    this.loadUserLeaves();
  }

  onUserChange(): void {
    this.pageNumber = 0;
    this.loadUserLeaves();
  }

  onLeaveTypeChange(): void {
    this.pageNumber = 0;
    this.loadUserLeaves();
  }

  onStatusChange(): void {
    this.pageNumber = 0;
    this.loadUserLeaves();
  }

  // Inline Editing Methods
  startEditing(row: UserLeave): void {
    this.editingRow = row.id;
    this.editedLeave = { leaveStatus: row.leaveStatus };
  }

  cancelEditing(): void {
    this.editingRow = null;
    this.editedLeave = {};
  }

  saveEdit(row: UserLeave): void {
    if (!this.editedLeave.leaveStatus) {
      this.toastr.warning('Please select a status');
      return;
    }

    this.isLoading = true;
    this.userLeaveService
      .updateLeaveStatus(row.id, this.editedLeave.leaveStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.editingRow = null;
          this.editedLeave = {};
          this.loadUserLeaves();
          this.toastr.success('Leave status updated successfully');
        },
        error: (error) => {
          this.isLoading = false;
          this.toastr.error(error.error.message);
        },
      });
  }

  getStatusClass(status: LeaveStatus): string {
    switch (status) {
      case LeaveStatus.Approved:
        return 'text-success';
      case LeaveStatus.Rejected:
        return 'text-danger';
      case LeaveStatus.Cancelled:
        return 'text-secondary';
      default:
        return 'text-warning';
    }
  }

  getStatusName(status: LeaveStatus): string {
    return LeaveStatus[status];
  }
}
