import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { enumToStringArray } from '../../../utils/common.utils';
import { StatusEnum } from '../../../enums/status.enum';
import { HttpClient } from '@angular/common/http';
import { ProductPackagingService } from '../../../Services/product-packaging.service';
import { Router } from '@angular/router';
import { GlobalStateService } from '../../../Services/global-state.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProductPackaging } from '../../../Models/product.packaging.model';
import { PackagingService } from '../../../Services/packaging.service';
import { PackagingBasicInfo } from '../../../Models/packaging.model';

@Component({
  selector: 'app-product-packaging-list',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxDatatableModule],
  templateUrl: './product-packaging-list.component.html',
  styleUrl: './product-packaging-list.component.css',
})
export class ProductPackagingListComponent implements OnInit {
  selectedStatus: any = '';
  searchTerm: string = '';
  pageSize: number = 10;
  currentPage: number = 1;
  totalRecords: number = 0;
  sortColumn: string = '';
  sortDirection: string = '';
  isLoading: boolean = false;
  packagingList: PackagingBasicInfo[] = [];
  productPackagings: ProductPackaging[] = [];
  statusList: string[] = enumToStringArray(StatusEnum);
  selectedPackaging: any = '';

  constructor(
    private productPackagingService: ProductPackagingService,
    private packagingService: PackagingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProductPackagings();
    this.loadPackagingList();
  }

  navigateToAddProductPackaging(): void {
    this.router.navigate(['main/product-packaging/add']);
  }

  loadPackagingList(): void {
    this.packagingService.getAllPackaging().subscribe({
      next: (response) => {
        this.packagingList = response || [];
      },
      error: () => {
        this.packagingList = [];
      },
    });
  }

  loadProductPackagings(): void {
    this.isLoading = true;
    const params: any = {
      page: this.currentPage.toString(),
      pageSize: this.pageSize.toString(),
      search: this.searchTerm,
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
      ...(this.selectedStatus ? { status: this.selectedStatus } : {}),
      ...(this.selectedPackaging
        ? { packagingId: this.selectedPackaging }
        : {}),
    };

    this.productPackagingService
      .getAllProductPackagingWithFilter(params)
      .subscribe({
        next: (response) => {
          this.productPackagings = response.data.data || [];
          this.totalRecords = response.data.totalRecords;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.productPackagings = [];
        },
      });
  }

  searchProductPackagings(): void {
    const trimmedText = this.searchTerm.trim();
    if (trimmedText.length >= 3 || trimmedText === '') {
      this.loadProductPackagings();
    }
  }

  onPage(event: any): void {
    this.currentPage = event.offset + 1;
    this.loadProductPackagings();
  }

  onSort(event: any): void {
    const sort = event.sorts[0];
    this.sortColumn = sort.prop;
    this.sortDirection = sort.dir;
    this.loadProductPackagings();
  }

  editProductPackaging(packaging: ProductPackaging): void {
    this.router.navigate(['main/product-packaging/edit', packaging.id]);
  }

  viewProductPackaging(packaging: ProductPackaging): void {
    this.router.navigate(['main/product-packaging/view', packaging.id]);
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadProductPackagings();
  }
}
