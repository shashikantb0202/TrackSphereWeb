import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { enumToStringArray } from '../../../utils/common.utils';
import { StatusEnum } from '../../../enums/status.enum';
import { HttpClient } from '@angular/common/http';
import { ProductCategoryService } from '../../../Services/product-category.service';
import { Router } from '@angular/router';
import { GlobalStateService } from '../../../Services/global-state.service';
import { ProductCategory } from '../../../Models/Product.category.model';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-product-category-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    DateFormatPipe,
  ],
  providers: [DatePipe],
  templateUrl: './product-category-list.component.html',
  styleUrl: './product-category-list.component.css',
})
export class ProductCategoryListComponent implements OnInit {
  selectedStatus: any = '';
  searchTerm: string = '';
  pageSize: number = 10;
  currentPage: number = 1;
  totalRecords: number = 0;
  sortColumn: string = '';
  sortDirection: string = '';
  isLoading: boolean = false;
  productCategories: ProductCategory[] = [];
  statusList: string[] = enumToStringArray(StatusEnum);

  constructor(
    private http: HttpClient,
    private productCategoryService: ProductCategoryService,
    private router: Router,
    private globalStateService: GlobalStateService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProductCategories();
  }

  navigateToAddCategory(): void {
    this.router.navigate(['main/product-category/add-category']);
  }

  loadProductCategories(): void {
    this.isLoading = true;
    const params: any = {
      page: this.currentPage.toString(),
      pageSize: this.pageSize.toString(),
      search: this.searchTerm,
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
      ...(this.selectedStatus ? { status: this.selectedStatus } : {}),
    };

    this.productCategoryService.getAllCategoriesWithFilter(params).subscribe({
      next: (response) => {
        this.productCategories = Array.isArray(response.data.data)
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

  searchCategories(): void {
    const trimmedText = this.searchTerm.trim();
    if (trimmedText.length >= 3 || trimmedText === '') {
      this.loadProductCategories();
    }
  }

  onPage(event: any): void {
    this.currentPage = event.offset + 1;
    this.loadProductCategories();
  }

  onSort(event: any): void {
    const sort = event.sorts[0];
    this.sortColumn = sort.prop;
    this.sortDirection = sort.dir;
    this.loadProductCategories();
  }

  editCategory(category: ProductCategory): void {
    this.router.navigate(['main/product-category/edit-category', category.id]);
  }

  viewCategory(category: ProductCategory): void {
    this.router.navigate(['main/product-category/view-category', category.id]);
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadProductCategories();
  }
}
