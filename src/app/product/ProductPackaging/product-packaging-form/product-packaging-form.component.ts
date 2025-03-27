import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ProductPackagingService } from '../../../Services/product-packaging.service';
import { PackagingService } from '../../../Services/packaging.service';
import { ProductService } from '../../../Services/product.service';
import { getDirtyValues } from '../../../utils/form.utils';
import { StatusEnum } from '../../../enums/status.enum';
import { enumToStringArray } from '../../../utils/common.utils';
import { PackagingBasicInfo } from '../../../Models/packaging.model';
import { ProductBasicInfo } from '../../../Models/product.model';
import { ProductPackaging } from '../../../Models/product.packaging.model';

@Component({
  selector: 'app-product-packaging-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-packaging-form.component.html',
  styleUrl: './product-packaging-form.component.css',
})
export class ProductPackagingFormComponent implements OnInit {
  productPackagingForm!: FormGroup;
  isEditMode = false;
  productPackagingId: number | null = null;
  isSubmitted: boolean = false;
  isLoading: boolean = false;
  statusList: string[] = enumToStringArray(StatusEnum);
  packagingList: PackagingBasicInfo[] = [];
  productList: ProductBasicInfo[] = [];

  constructor(
    private fb: FormBuilder,
    private productPackagingService: ProductPackagingService,
    private packagingService: PackagingService,
    private productService: ProductService,
    private route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPackagings();
    this.loadProducts();
    this.checkEditMode();
  }

  private initForm(): void {
    this.productPackagingForm = this.fb.group({
      productPackName: ['', [Validators.required, Validators.minLength(3)]],
      productId: ['', Validators.required],
      packagingId: ['', Validators.required],
      mrp: ['', [Validators.required, Validators.min(1)]],
      dPrice: ['', [Validators.required, Validators.min(1)]],
      pPrice: ['', [Validators.required, Validators.min(1)]],
      minSalePrice: ['', [Validators.required, Validators.min(1)]],
      maxSalePrice: ['', [Validators.required, Validators.min(1)]],
      minOrderQty: ['', [Validators.required, Validators.min(1)]],
      status: ['Active', Validators.required],
    });
  }

  private loadPackagings(): void {
    this.packagingService.getAllPackaging().subscribe({
      next: (packagingList) => {
        this.packagingList = packagingList;
      },
      error: () => {
        this.toastr.error('Failed to load packagings.');
      },
    });
  }

  private loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (productList) => {
        this.productList = productList;
      },
      error: () => {
        this.toastr.error('Failed to load products.');
      },
    });
  }

  private checkEditMode(): void {
    this.productPackagingId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.productPackagingId;

    if (this.isEditMode) {
      this.isLoading = true;
      this.productPackagingService
        .getProductPackagingById(this.productPackagingId)
        .subscribe({
          next: (productPackagingData) => {
            this.patchFormData(productPackagingData);
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
          },
        });
    }
  }

  patchFormData(productPackagingData: ProductPackaging): void {
    this.isEditMode = true;
    this.productPackagingForm.patchValue({
      productId: productPackagingData.product.id,
      packagingId: productPackagingData.packaging.id,
      mrp: productPackagingData.mrp,
      productPackName: productPackagingData.productPackName,
      pPrice: productPackagingData.pPrice,
      dPrice: productPackagingData.dPrice,
      minSalePrice: productPackagingData.minSalePrice,
      maxSalePrice: productPackagingData.maxSalePrice,
      minOrderQty: productPackagingData.minOrderQty,
      status: productPackagingData.status,
    });
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.productPackagingForm.invalid) return;

    this.isLoading = true;

    if (this.isEditMode) {
      const updatedData = getDirtyValues(this.productPackagingForm);

      if (Object.keys(updatedData).length === 0) {
        this.isLoading = false;
        this.toastr.info('No changes detected.');
        return;
      }

      this.productPackagingService
        .updateProductPackaging(this.productPackagingId!, updatedData)
        .subscribe({
          next: (response) => {
            this.toastr.success(response.message);
            this.isLoading = false;
            this.router.navigate([
              'main/product-packaging/view',
              this.productPackagingId,
            ]);
          },
          error: (error) => {
            this.isLoading = false;
            this.toastr.error(error.message);
          },
        });
    } else {
      this.productPackagingService
        .addProductPackaging(this.productPackagingForm.value)
        .subscribe({
          next: (response) => {
            this.toastr.success(response.message);
            this.isLoading = false;
            this.router.navigate([
              'main/product-packaging/view',
              response.data.id,
            ]);
          },
          error: (error) => {
            this.isLoading = false;
            this.toastr.error(error.message);
          },
        });
    }
  }
}
