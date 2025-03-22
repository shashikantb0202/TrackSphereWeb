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
import { ProductCategoryService } from '../../../Services/product-category.service';
import { getDirtyValues } from '../../../utils/form.utils';
import { StatusEnum } from '../../../enums/status.enum';
import { enumToStringArray } from '../../../utils/common.utils';
import { ProductCategory } from '../../../Models/Product.category.model';

@Component({
  selector: 'app-product-category-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-category-form.component.html',
  styleUrl: './product-category-form.component.css',
})
export class ProductCategoryFormComponent implements OnInit {
  categoryForm!: FormGroup;
  isEditMode = false;
  categoryId: number | null = null;
  isSubmitted: boolean = false;
  isLoading: boolean = false;
  statusList: string[] = enumToStringArray(StatusEnum);

  constructor(
    private fb: FormBuilder,
    private productCategoryService: ProductCategoryService,
    private route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      priority: ['', [Validators.required]],
      status: ['Active', Validators.required],
    });
  }

  private checkEditMode(): void {
    this.categoryId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.categoryId;

    if (this.isEditMode) {
      this.isLoading = true;
      this.productCategoryService.getCategoryById(this.categoryId).subscribe({
        next: (categoryData) => {
          this.patchFormData(categoryData);
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }

  patchFormData(categoryData: ProductCategory): void {
    this.isEditMode = true;
    this.categoryForm.patchValue({
      name: categoryData.name,
      priority: categoryData.priority,
      status: categoryData.status,
    });
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.categoryForm.invalid) return;

    this.isLoading = true;

    if (this.isEditMode) {
      const updatedData = getDirtyValues(this.categoryForm);

      if (Object.keys(updatedData).length === 0) {
        this.isLoading = false;
        this.toastr.info('No changes detected.');
        return;
      }

      this.productCategoryService
        .updateCategory(this.categoryId!, updatedData)
        .subscribe({
          next: (response) => {
            this.toastr.success(response.message);
            this.isLoading = false;
            this.router.navigate(['main/product-category/category-list']);
          },
          error: (error) => {
            this.isLoading = false;
            this.toastr.error(error.message);
          },
        });
    } else {
      this.productCategoryService
        .addCategory(this.categoryForm.value)
        .subscribe({
          next: (response) => {
            this.toastr.success(response.message);
            this.isLoading = false;
            this.router.navigate(['main/product-category/category-list']);
          },
          error: (error) => {
            this.isLoading = false;
            this.toastr.error(error.message);
          },
        });
    }
  }
}
