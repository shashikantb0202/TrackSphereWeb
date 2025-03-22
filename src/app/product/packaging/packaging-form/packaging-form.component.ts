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
import { PackagingService } from '../../../Services/packaging.service';
import { getDirtyValues } from '../../../utils/form.utils';
import { StatusEnum } from '../../../enums/status.enum';
import { enumToStringArray } from '../../../utils/common.utils';
import { Packaging, Unit } from '../../../Models/packaging.model';

@Component({
  selector: 'app-packaging-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './packaging-form.component.html',
  styleUrl: './packaging-form.component.css',
})
export class PackagingFormComponent implements OnInit {
  packagingForm!: FormGroup;
  isEditMode = false;
  packagingId: number | null = null;
  isSubmitted: boolean = false;
  isLoading: boolean = false;
  statusList: string[] = enumToStringArray(StatusEnum);
  unitList: Unit[] = []; // Store fetched units

  constructor(
    private fb: FormBuilder,
    private packagingService: PackagingService,
    private route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUnits(); // Load units from API
    this.checkEditMode();
  }

  private initForm(): void {
    this.packagingForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      unitId: ['', [Validators.required]],
      status: ['Active', Validators.required],
    });
  }

  private loadUnits(): void {
    this.packagingService.getAllUnits().subscribe({
      next: (units) => {
        this.unitList = units; // Assign fetched units to dropdown list
      },
      error: (error) => {
        this.toastr.error('Failed to load units');
      },
    });
  }

  private checkEditMode(): void {
    this.packagingId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.packagingId;

    if (this.isEditMode) {
      this.isLoading = true;
      this.packagingService.getPackagingById(this.packagingId).subscribe({
        next: (packagingData) => {
          this.patchFormData(packagingData);
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }

  patchFormData(packagingData: Packaging): void {
    this.isEditMode = true;
    this.packagingForm.patchValue({
      name: packagingData.name,
      unitId: packagingData.unit.id,
      status: packagingData.status,
    });
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.packagingForm.invalid) return;

    this.isLoading = true;

    if (this.isEditMode) {
      const updatedData = getDirtyValues(this.packagingForm);

      if (Object.keys(updatedData).length === 0) {
        this.isLoading = false;
        this.toastr.info('No changes detected.');
        return;
      }

      this.packagingService
        .updatePackaging(this.packagingId!, updatedData)
        .subscribe({
          next: (response) => {
            this.toastr.success(response.message);
            this.isLoading = false;
            this.router.navigate(['main/packaging/packaging-list']);
          },
          error: (error) => {
            this.isLoading = false;
            this.toastr.error(error.message);
          },
        });
    } else {
      this.packagingService.addPackaging(this.packagingForm.value).subscribe({
        next: (response) => {
          this.toastr.success(response.message);
          this.isLoading = false;
          this.router.navigate(['main/packaging/packaging-list']);
        },
        error: (error) => {
          this.isLoading = false;
          this.toastr.error(error.message);
        },
      });
    }
  }
}
