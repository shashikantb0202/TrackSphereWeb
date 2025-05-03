import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { CustomerVisit } from '../../../Models/customer.visit.model';
import { CustomerVisitService } from '../../../Services/customer.visit.service';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-view-customer-visit',
  standalone: true,
  imports: [CommonModule, DateFormatPipe],
  providers: [DatePipe],
  templateUrl: './view-customer-visit.component.html',
  styleUrl: './view-customer-visit.component.css',
})
export class ViewCustomerVisitComponent implements OnInit {
  customerVisitId: number = 0;
  isLoading: boolean = false;
  customerVisit: CustomerVisit | any = {};

  constructor(
    private customerVisitService: CustomerVisitService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getCustomerVisitDetails();
  }

  private getCustomerVisitDetails(): void {
    this.customerVisitId = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoading = true;
    this.customerVisitService
      .getCustomerVisitById(this.customerVisitId)
      .subscribe({
        next: (customerVisitData) => {
          this.customerVisit = customerVisitData;
          this.customerVisit.createdOn = new Date(customerVisitData.createdOn);
          if (customerVisitData.updatedOn) {
            this.customerVisit.updatedOn = new Date(
              customerVisitData.updatedOn
            );
          }
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  editCustomerVisit(): void {
    this.router.navigate(['main/customer-visit/edit', this.customerVisit.id]);
  }
  getFullImageUrl(imageUrl: string): string {
    const baseUrl = environment.apiUrl; // Change this to your actual server URL
    return imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`;
  }
}
