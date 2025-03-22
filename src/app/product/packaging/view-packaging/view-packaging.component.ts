import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PackagingService } from '../../../Services/packaging.service';
import { Packaging } from '../../../Models/packaging.model';

@Component({
  selector: 'app-view-packaging',
  imports: [CommonModule],
  templateUrl: './view-packaging.component.html',
  styleUrl: './view-packaging.component.css',
})
export class ViewPackagingComponent {
  packagingId: number = 0;
  isLoading: boolean = false;
  packaging: Packaging | any = {};

  constructor(
    private packagingService: PackagingService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getPackagingDetails();
  }

  private getPackagingDetails(): void {
    this.packagingId = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoading = true;

    this.packagingService.getPackagingById(this.packagingId).subscribe({
      next: (packagingData) => {
        this.packaging = packagingData;
        this.packaging.createdOn = new Date(packagingData.createdOn);
        this.packaging.updatedOn = packagingData.updatedOn
          ? new Date(packagingData.updatedOn)
          : null;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  editPackaging(): void {
    this.router.navigate(['main/packaging/edit', this.packaging.id]);
  }
}
