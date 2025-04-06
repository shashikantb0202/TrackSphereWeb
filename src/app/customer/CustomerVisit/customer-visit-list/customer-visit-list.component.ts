import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  DatatableComponent,
  NgxDatatableModule,
} from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { DropdownService } from '../../../Services/dropdown.service';
import { CustomerVisit } from '../../../Models/customer.visit.model';
import { CustomerVisitService } from '../../../Services/customer.visit.service';
import { UserService } from '../../../Services/user.service';
import { CustomerService } from '../../../Services/customer.service';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-customer-visit-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    DateFormatPipe,
  ],
  providers: [DatePipe],
  templateUrl: './customer-visit-list.component.html',
  styleUrl: './customer-visit-list.component.css',
})
export class CustomerVisitListComponent implements OnInit {
  visits: CustomerVisit[] = [];
  searchTerm: string = '';
  pageSize: number = 5;
  currentPage: number = 1;
  totalRecords: number = 0;
  sortColumn: string = '';
  sortDirection: string = '';
  isLoading: boolean = false;

  @ViewChild(DatatableComponent) ngxDatatable!: DatatableComponent;

  userList: any[] = [];
  customerList: any[] = [];
  customerVisitTypeList: any[] = [];
  selectedUserId: number = 0;
  selectedCustomerId: number = 0;
  selectedCustomerVisitTypeId: number = 0;
  visitDate: string = '';

  constructor(
    private customerVisitService: CustomerVisitService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private dropDownService: DropdownService,
    private userService: UserService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.loadVisits();
    this.loadDropdownData();
  }

  loadDropdownData(): void {
    this.userService.getAllUser().subscribe((data) => (this.userList = data));

    this.dropDownService
      .getCustomerVisitType()
      .subscribe((data) => (this.customerVisitTypeList = data));

    this.customerService
      .getAllCustomers()
      .subscribe((data) => (this.customerList = data));
  }

  loadVisits(): void {
    this.isLoading = true;
    const params: any = {
      page: this.currentPage.toString(),
      pageSize: this.pageSize.toString(),
      ...(this.selectedUserId ? { userId: this.selectedUserId } : {}),
      ...(this.selectedCustomerId
        ? { customerId: this.selectedCustomerId }
        : {}),
      ...(this.selectedCustomerVisitTypeId
        ? { customerVisitTypeId: this.selectedCustomerVisitTypeId }
        : {}),
      ...(this.visitDate ? { visitDate: this.visitDate } : {}),
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
    };

    this.customerVisitService.getAllCustomerVisitsWithFilter(params).subscribe({
      next: (response) => {
        this.visits = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        this.totalRecords = response.data.totalRecords;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.totalRecords = 0;
      },
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadVisits();
  }

  onPage(event: any): void {
    this.currentPage = event.offset + 1;
    this.loadVisits();
  }

  onSort(event: any): void {
    const sort = event.sorts[0];
    this.sortColumn = sort.prop;
    this.sortDirection = sort.dir;
    this.loadVisits();
  }

  viewVisit(visit: CustomerVisit): void {
    this.router.navigate(['main/customer/view-customerVisit', visit.id]);
  }
}
