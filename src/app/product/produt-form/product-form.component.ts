import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Product, ProductCategory } from '../../Models/product.model';
import { ProductService } from '../../Services/product.service';
import { ProductCategoryService } from '../../Services/product-category.service';
import { getDirtyValues } from '../../utils/form.utils';
import { StatusEnum } from '../../enums/status.enum';
import { enumToStringArray } from '../../utils/common.utils';

@Component({
  selector: 'app-product-form.component',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
   templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {


  productForm!: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  isSubmitted: boolean = false;
  categories: ProductCategory[] = [];
  isLoading: boolean = false;
  selectedFiles: { name: string; file: File; preview?: string }[] = [];
  statusList:string[]= enumToStringArray(StatusEnum); 


  constructor(
      private fb: FormBuilder,
      private productService: ProductService,
      private route: ActivatedRoute,
      public router: Router,
      private productCategoryService: ProductCategoryService,
      private toastr: ToastrService
  ) {}

  ngOnInit(): void {
      this.initForm();
      this.checkEditMode();
      this.loadDropdownData();
  }

  loadDropdownData(): void {
    this.productCategoryService.getAllProductsCategory().subscribe(data => this.categories = data);
  }

  private initForm(): void {
    this.productForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        productCategoryId: [null, Validators.required],
        hsCode: ['', [Validators.pattern(/^\d{6,10}$/)]],  // Valid HS Code (6-10 digits)
        gstPer: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        description: ['', [Validators.required, Validators.minLength(10)]],
        benefits: ['', [Validators.required, Validators.minLength(10)]],
        howToUse: ['', [Validators.required, Validators.minLength(10)]],
        youtubeLink: [''], // No validation as per request
        returnPolicy: ['', Validators.required],
        status: ['', Validators.required]
    });
  }

  private checkEditMode(): void {
      this.productId = Number(this.route.snapshot.paramMap.get('id'));
      this.isEditMode = !!this.productId;

      if (this.isEditMode) {
        this.isLoading = true;
        this.productService.getProductById(this.productId).subscribe(
          {
            next: (productData) => {
              this.patchFormData(productData);
              this.isLoading = false;
            },
            error: () => {
              this.isLoading = false;
            }
          });
      }
  }

  patchFormData(productData: Product): void {
      this.isEditMode = true;
      this.productForm.patchValue({
          name: productData.name,
          productCategoryId: productData.productCategoryId,
          hsCode: productData.hsCode,
          gstPer: productData.gstPer,
          description: productData.description,
          benefits: productData.benefits,
          howToUse: productData.howToUse,
          youtubeLink: productData.youtubeLink,
          returnPolicy: productData.returnPolicy,
          status:productData.status
      });
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.productForm.invalid) return;

    const formData = new FormData();
    this.isLoading = true;

    if (this.isEditMode) {
        const updatedData = getDirtyValues(this.productForm);

        if (Object.keys(updatedData).length === 0) {
            this.isLoading = false;
            this.toastr.info('No changes detected.');
            return;
        }

        this.productService.updateProduct(this.productId!, updatedData).subscribe({
            next: (response) => {
                this.toastr.success(response.message);
                this.isLoading = false;
                this.router.navigate(['main/product/product-list']);
            },
            error: (error) => {
                this.isLoading = false;
                this.toastr.error(error.message);
            }
        });
    } 
     else {

        if (this.selectedFiles.length === 0) {
            this.toastr.error('Please upload at least one product Image.');
            this.isLoading = false;
            return;
        }
          // Append form fields
        Object.keys(this.productForm.value).forEach(key => {
            formData.append(key, this.productForm.get(key)?.value);
        });

        // Append selected files
        this.selectedFiles.forEach((fileData, index) => {
            formData.append(`Images`, fileData.file);  // Use `productImages` as the key in API
        });
        this.productService.addProduct(formData).subscribe({
            next: (response) => {
                this.toastr.success(response.message);
                this.isLoading = false;
                this.router.navigate(['main/product/product-list']);
            },
            error: (error) => {
                this.isLoading = false;
                this.toastr.error(error.message);
            }
        });
    }
}



 /** Handle File Selection */
 onFileSelected(event: any): void {
    const files = event.target.files;

    for (const file of files) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
            this.selectedFiles.push({
                name: file.name,
                file: file,
                preview: e.target.result
            });
        };

        reader.readAsDataURL(file);
    }
}

/** Remove Selected File */
removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
}



}
