import { Component, OnInit } from '@angular/core';
import { Product } from '../../../Models/product.model';
import { ProductService } from '../../../Services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { environment } from '../../../../environment';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [CommonModule, DateFormatPipe],
  providers: [DatePipe],
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.css',
})
export class ViewProductComponent implements OnInit {
  productId: number = 0;
  isLoading: boolean = false;
  product: Product | any = {};

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    public router: Router
  ) {}
  ngOnInit(): void {
    this.GetProductDetails();
  }
  private GetProductDetails(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoading = true;
    this.productService.getProductById(this.productId).subscribe({
      next: (productData) => {
        this.product = productData;
        this.product.createdOn = new Date(productData.createdOn);
        this.product.updatedOn = new Date(productData!.updatedOn!);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      },
    });
  }

  editProduct(): void {
    this.router.navigate(['main/product/edit-product', this.product.id]);
  }
  getFullImageUrl(imageUrl: string): string {
    const baseUrl = environment.apiUrl; // Change this to your actual server URL
    return imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`;
  }
}
