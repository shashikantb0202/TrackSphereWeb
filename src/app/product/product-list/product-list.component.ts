import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Product, ProductCategory } from '../../Models/product.model';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../Services/product.service';
import { Router } from '@angular/router';
import { GlobalStateService } from '../../Services/global-state.service';
import { ProductCategoryService } from '../../Services/product-category.service';
import { enumToStringArray } from '../../utils/common.utils';
import { StatusEnum } from '../../enums/status.enum';

@Component({
  selector: 'app-product-list',
   imports: [CommonModule,
                FormsModule,
                ReactiveFormsModule,NgxDatatableModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  selectedStatus: any='';
  products: Product[] = [];
  searchTerm: string = '';
  pageSize: number = 10;
  currentPage: number = 1;
  totalRecords: number = 0;
  sortColumn: string = '';
  sortDirection: string = '';
  isLoading: boolean=false;
  @ViewChild(DatatableComponent) ngxDatatable!: DatatableComponent;
  categoryList: ProductCategory|any=[];
  selectedCategory: any=0;
  statusList:string[]= enumToStringArray(StatusEnum); 
  constructor(private http: HttpClient,
    private productService:ProductService,
    private router: Router,
    private globalStateService: GlobalStateService,
    private cdRef: ChangeDetectorRef,
  private productCategoryService:ProductCategoryService) {}

 

  ngOnInit(): void {
    this.loadProducts();
    this.loadDropdownData();
    // this.globalStateService.isCollapsed$.subscribe(() => {
    //   setTimeout(() => {
    //     this.cdRef.detectChanges();
    //     this.ngxDatatable.recalculate(); // Ensure proper resizing
    //   }, 300); // Delay to allow layout changes before recalculating
    // });
  }

  navigateToAddProduct(): void {
    this.router.navigate(['main/product/add-product']);
  }
  loadDropdownData(): void {
    this.productCategoryService.getAllProductsCategory().subscribe(data => this.categoryList = data);
  }
  loadProducts(): void {
    this.isLoading = true; 
    const params: any = {
      page: this.currentPage.toString(),
      pageSize: this.pageSize.toString(),
      search: this.searchTerm,
      ProductCategoryId: this.selectedCategory,
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
      ...(this.selectedStatus ? { status: this.selectedStatus } : {}) // Adds only if selectedStatus has a value
    };
    this.productService.getAllProductsWithFilter(params).subscribe(
      {
        next: (response) => {
          this.products = Array.isArray(response.data.data) ? response.data.data : []; // ✅ Ensure `data.data` is an array
          this.totalRecords = response.data.totalRecords; // ✅ Access `totalRecords` directly
          this.isLoading = false; 
        },
        error: (error) => {
          this.isLoading = false; 
          this.totalRecords =error.data;
        }
      });
  }

   // Load Users with Search Logic
   searchProducts(): void {
    const trimmedText = this.searchTerm.trim();
    // Trigger only if 3+ characters entered or empty string
    if (trimmedText.length >= 3 || trimmedText === '') {
      this.loadProducts();
    }
}

  onPage(event: any): void {
    this.currentPage = event.offset + 1; // ngx-datatable starts at 0
    this.loadProducts();
  }

  onSort(event: any): void {
    const sort = event.sorts[0];
    this.sortColumn = sort.prop;
    this.sortDirection = sort.dir;
    this.loadProducts();
  }
  editProduct(product: Product): void {
    this.router.navigate(['main/product/edit-product', product.id]);
  }
  
  viewProduct(product: Product): void {
    this.router.navigate(['main/product/view-product', product.id]);
  }
  onSearch() {
    this.currentPage = 1; // ngx-datatable starts at 0
      this.loadProducts();
  }
}