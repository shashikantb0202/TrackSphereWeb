import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SalaryStructure } from '../../../Models/salary-structure.model';
import { SalaryManagementService } from '../../../Services/salary-management.service';

@Component({
  selector: 'app-view-salary-structure',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-salary-structure.component.html',
  styleUrls: ['./view-salary-structure.component.css'],
})
export class ViewSalaryStructureComponent implements OnInit {
  salaryStructureId: number = 0;
  isLoading: boolean = false;
  salaryStructure: SalaryStructure | any = {};

  constructor(
    private salaryService: SalaryManagementService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getSalaryStructureDetails();
  }

  private getSalaryStructureDetails(): void {
    this.salaryStructureId = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoading = true;
    this.salaryService
      .getSalaryStructureById(this.salaryStructureId)
      .subscribe({
        next: (response) => {
          this.salaryStructure = response.data;
          this.salaryStructure.createdOn = new Date(response.data.createdOn);
          if (response.data.updatedOn) {
            this.salaryStructure.updatedOn = new Date(response.data.updatedOn);
          }
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  editSalaryStructure(): void {
    this.router.navigate([
      'main/salary-management/salary-structures/edit',
      this.salaryStructure.id,
    ]);
  }
}
