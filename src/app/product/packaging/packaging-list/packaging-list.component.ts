import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { enumToStringArray } from '../../../utils/common.utils';
import { StatusEnum } from '../../../enums/status.enum';
import { HttpClient } from '@angular/common/http';
import { PackagingService } from '../../../Services/packaging.service';
import { Router } from '@angular/router';
import { GlobalStateService } from '../../../Services/global-state.service';
import { Packaging } from '../../../Models/packaging.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-packaging-list',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxDatatableModule],
  templateUrl: './packaging-list.component.html',
  styleUrl: './packaging-list.component.css',
})
export class PackagingListComponent implements OnInit {
  selectedStatus: any = '';
  searchTerm: string = '';
  pageSize: number = 10;
  currentPage: number = 1;
  totalRecords: number = 0;
  sortColumn: string = '';
  sortDirection: string = '';
  isLoading: boolean = false;
  packagings: Packaging[] = [];
  statusList: string[] = enumToStringArray(StatusEnum);

  constructor(
    private http: HttpClient,
    private packagingService: PackagingService,
    private router: Router,
    private globalStateService: GlobalStateService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPackagings();
  }

  navigateToAddPackaging(): void {
    this.router.navigate(['main/packaging/add-packaging']);
  }

  loadPackagings(): void {
    this.isLoading = true;
    const params: any = {
      page: this.currentPage.toString(),
      pageSize: this.pageSize.toString(),
      search: this.searchTerm,
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
      ...(this.selectedStatus ? { status: this.selectedStatus } : {}),
    };

    this.packagingService.getAllPackagingWithFilter(params).subscribe({
      next: (response) => {
        this.packagings = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        this.totalRecords = response.data.totalRecords;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.totalRecords = error.data;
      },
    });
  }

  searchPackagings(): void {
    const trimmedText = this.searchTerm.trim();
    if (trimmedText.length >= 3 || trimmedText === '') {
      this.loadPackagings();
    }
  }

  onPage(event: any): void {
    this.currentPage = event.offset + 1;
    this.loadPackagings();
  }

  onSort(event: any): void {
    const sort = event.sorts[0];
    this.sortColumn = sort.prop;
    this.sortDirection = sort.dir;
    this.loadPackagings();
  }

  editPackaging(packaging: Packaging): void {
    this.router.navigate(['main/packaging/edit-packaging', packaging.id]);
  }

  viewPackaging(packaging: Packaging): void {
    this.router.navigate(['main/packaging/view-packaging', packaging.id]);
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadPackagings();
  }
}
