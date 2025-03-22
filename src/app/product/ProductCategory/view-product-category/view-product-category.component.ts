import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductCategoryService } from '../../../Services/product-category.service';
import { ProductCategory } from '../../../Models/Product.category.model';

@Component({
  selector: 'app-view-product-category',
  imports: [CommonModule],
  templateUrl: './view-product-category.component.html',
  styleUrl: './view-product-category.component.css',
})
export class ViewProductCategoryComponent {
  categoryId: number = 0;
  isLoading: boolean = false;
  category: ProductCategory | any = {};

  constructor(
    private categoryService: ProductCategoryService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getCategoryDetails();
  }

  private getCategoryDetails(): void {
    this.categoryId = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoading = true;

    this.categoryService.getCategoryById(this.categoryId).subscribe({
      next: (categoryData) => {
        this.category = categoryData;
        this.category.createdOn = new Date(categoryData.createdOn);
        this.category.updatedOn = categoryData.updatedOn
          ? new Date(categoryData.updatedOn)
          : null;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  editCategory(): void {
    this.router.navigate([
      'main/product-category/edit-category',
      this.category.id,
    ]);
  }
}
