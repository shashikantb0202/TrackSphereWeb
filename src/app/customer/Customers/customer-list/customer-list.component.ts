import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  DatatableComponent,
  NgxDatatableModule,
} from '@swimlane/ngx-datatable';
import { Customer } from '../../../Models/customer.model';
import { HttpClient } from '@angular/common/http';
import { CustomerService } from '../../../Services/customer.service';
import { Router } from '@angular/router';
import { GlobalStateService } from '../../../Services/global-state.service';
import { StatusEnum } from '../../../enums/status.enum';
import { enumToStringArray } from '../../../utils/common.utils';
import { DropdownService } from '../../../Services/dropdown.service';

@Component({
  selector: 'app-customer-list',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxDatatableModule],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css',
})
export class CustomerListComponent implements OnInit {
  selectedStatus: any = '';
  customers: Customer[] = [];
  searchTerm: string = '';
  pageSize: number = 5;
  currentPage: number = 1;
  totalRecords: number = 0;
  sortColumn: string = '';
  sortDirection: string = '';
  isLoading: boolean = false;
  @ViewChild(DatatableComponent) ngxDatatable!: DatatableComponent;
  customerTypeList: any[] = [];
  stateList: any[] = [];
  contryList: any[] = [];
  cityList: any[] = [];
  selectedCustomerType: any = 0;
  selectedState: any = 0;
  selectedCity: any = 0;
  statusList: string[] = enumToStringArray(StatusEnum);

  constructor(
    private http: HttpClient,
    private customerService: CustomerService,
    private router: Router,
    private globalStateService: GlobalStateService,
    private cdRef: ChangeDetectorRef,
    private dropDownService: DropdownService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
    this.loadDropdownData();
  }

  navigateToAddCustomer(): void {
    this.router.navigate(['main/customer/add-customer']);
  }

  loadDropdownData(): void {
    this.dropDownService
      .getCustomerType()
      .subscribe((data) => (this.customerTypeList = data));

    this.dropDownService.getCountries().subscribe((data) => {
      this.contryList = data;

      if (this.contryList.length > 0) {
        const firstCountryId = this.contryList[0].id; // Get first country ID
        this.GetStatesByCountryId(firstCountryId);
      }
    });
  }

  GetStatesByCountryId(id: any) {
    this.dropDownService
      .getStatesByCountry(id)
      .subscribe((data) => (this.stateList = data));
  }

  loadCities(): void {
    if (this.selectedState) {
      this.dropDownService
        .getCitiesByState(this.selectedState)
        .subscribe((data) => (this.cityList = data));
    } else {
      this.cityList = [];
    }
  }

  loadCustomers(): void {
    this.isLoading = true;
    const params: any = {
      page: this.currentPage.toString(),
      pageSize: this.pageSize.toString(),
      search: this.searchTerm,
      customerTypeId: this.selectedCustomerType,
      stateId: this.selectedState,
      cityId: this.selectedCity,
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
      ...(this.selectedStatus ? { status: this.selectedStatus } : {}),
    };
    this.customerService.getAllCustomersWithFilter(params).subscribe({
      next: (response) => {
        this.customers = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        this.totalRecords = response.data.data.length;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.totalRecords = 0;
      },
    });
  }

  searchCustomers(): void {
    const trimmedText = this.searchTerm.trim();
    if (trimmedText.length >= 3 || trimmedText === '') {
      this.loadCustomers();
    }
  }

  onPage(event: any): void {
    this.currentPage = event.offset + 1;
    this.loadCustomers();
  }

  onSort(event: any): void {
    const sort = event.sorts[0];
    this.sortColumn = sort.prop;
    this.sortDirection = sort.dir;
    this.loadCustomers();
  }

  editCustomer(customer: Customer): void {
    this.router.navigate(['main/customer/edit-customer', customer.id]);
  }

  viewCustomer(customer: Customer): void {
    this.router.navigate(['main/customer/view-customer', customer.id]);
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadCustomers();
  }
}
