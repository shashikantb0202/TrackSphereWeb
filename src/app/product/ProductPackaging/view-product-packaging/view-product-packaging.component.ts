import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductPackagingService } from '../../../Services/product-packaging.service';
import { ProductPackaging } from '../../../Models/product.packaging.model';

@Component({
  selector: 'app-view-product-packaging',
  imports: [CommonModule],
  templateUrl: './view-product-packaging.component.html',
  styleUrl: './view-product-packaging.component.css',
})
export class ViewProductPackagingComponent {
  productPackagingId: number = 0;
  isLoading: boolean = false;
  productPackaging: ProductPackaging | any = {};

  constructor(
    private productPackagingService: ProductPackagingService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getProductPackagingDetails();
  }

  private getProductPackagingDetails(): void {
    this.productPackagingId = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoading = true;

    this.productPackagingService
      .getProductPackagingById(this.productPackagingId)
      .subscribe({
        next: (productPackagingData) => {
          this.productPackaging = productPackagingData;
          this.productPackaging.createdOn = new Date(
            productPackagingData.createdOn
          );
          this.productPackaging.updatedOn = productPackagingData.updatedOn
            ? new Date(productPackagingData.updatedOn)
            : null;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  editProductPackaging(): void {
    this.router.navigate([
      'main/product-packaging/edit',
      this.productPackaging.id,
    ]);
  }
}
