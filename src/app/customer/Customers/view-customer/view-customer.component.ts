import { Component } from '@angular/core';
import { Customer } from '../../../Models/customer.model';
import { CustomerService } from '../../../Services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-customer',
  imports: [CommonModule],
  templateUrl: './view-customer.component.html',
  styleUrl: './view-customer.component.css',
})
export class ViewCustomerComponent {
  customerId: number = 0;
  isLoading: boolean = false;
  customer: Customer | any = {};

  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getCustomerDetails();
  }

  private getCustomerDetails(): void {
    this.customerId = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoading = true;
    this.customerService.getCustomerById(this.customerId).subscribe({
      next: (customerData) => {
        this.customer = customerData;
        this.customer.createdOn = new Date(customerData.createdOn);
        if (customerData.updatedOn) {
          this.customer.updatedOn = new Date(customerData.updatedOn);
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  editCustomer(): void {
    this.router.navigate(['main/customer/edit-customer', this.customer.id]);
  }
}
