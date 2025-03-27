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
import { Customer } from '../../../Models/customer.model';
import { CustomerService } from '../../../Services/customer.service';
import { getDirtyValues } from '../../../utils/form.utils';
import { StatusEnum } from '../../../enums/status.enum';
import { enumToStringArray } from '../../../utils/common.utils';
import {
  CustomerTypeBasicInfo,
  LocationBasicInfo,
} from '../../../Models/common.model';
import { DropdownService } from '../../../Services/dropdown.service';

@Component({
  selector: 'app-customer-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.css',
})
export class CustomerFormComponent implements OnInit {
  customerForm!: FormGroup;
  isEditMode = false;
  customerId: number | null = null;
  isSubmitted: boolean = false;
  customerTypes: CustomerTypeBasicInfo[] = [];
  countries: LocationBasicInfo[] = [];
  states: LocationBasicInfo[] = [];
  cities: LocationBasicInfo[] = [];
  isLoading: boolean = false;
  statusList: string[] = enumToStringArray(StatusEnum);

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    public router: Router,
    private dropdownService: DropdownService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
    this.loadDropdownData();
  }

  loadDropdownData(): void {
    this.dropdownService
      .getCustomerType()
      .subscribe((data) => (this.customerTypes = data));

    this.dropdownService
      .getCountries()
      .subscribe((data) => (this.countries = data));
  }

  onCountryChange(): void {
    const countryId = this.customerForm.get('countryId')?.value;
    if (countryId) {
      this.dropdownService
        .getStatesByCountry(countryId)
        .subscribe((data) => (this.states = data));
      this.cities = [];
    }
  }

  onStateChange(): void {
    const stateId = this.customerForm.get('stateId')?.value;
    if (stateId) {
      this.dropdownService
        .getCitiesByState(stateId)
        .subscribe((data) => (this.cities = data));
    }
  }

  private initForm(): void {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      contactNo: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      pincode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      customerTypeId: [null, Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      landmark: ['', Validators.required],
      countryId: [null, Validators.required],
      stateId: [null, Validators.required],
      cityId: [null, Validators.required],
      status: ['Active', Validators.required],
      gstNo: [''],
    });
  }

  private checkEditMode(): void {
    this.customerId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.customerId;

    if (this.isEditMode) {
      this.isLoading = true;
      this.customerService.getCustomerById(this.customerId).subscribe({
        next: (customerData) => {
          this.patchFormData(customerData);
          this.onCountryChange();
          this.onStateChange();
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }

  patchFormData(customerData: Customer): void {
    this.isEditMode = true;
    this.customerForm.patchValue({
      name: customerData.name,
      email: customerData.email,
      contactNo: customerData.contactNo,
      addressLine1: customerData.addressLine1,
      addressLine2: customerData.addressLine2,
      landmark: customerData.landmark,
      pincode: customerData.pincode,
      customerTypeId: customerData.customerType.id,
      countryId: customerData.country.id,
      stateId: customerData.state.id,
      cityId: customerData.city.id,
      status: customerData.status,
      gstNo: customerData.gstNo,
    });
    this.onCountryChange();
    this.onStateChange();
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.customerForm.invalid) return;

    this.isLoading = true;
    if (this.isEditMode) {
      const updatedData = getDirtyValues(this.customerForm);

      if (Object.keys(updatedData).length === 0) {
        this.isLoading = false;
        this.toastr.info('No changes detected.');
        return;
      }

      this.customerService
        .updateCustomer(this.customerId!, updatedData)
        .subscribe({
          next: (response) => {
            this.toastr.success(response.message);
            this.isLoading = false;
            this.router.navigate(['main/customer/customer-list']);
          },
          error: (error) => {
            this.isLoading = false;
            this.toastr.error(error.message);
          },
        });
    } else {
      this.customerService.addCustomer(this.customerForm.value).subscribe({
        next: (response) => {
          this.toastr.success(response.message);
          this.isLoading = false;
          this.router.navigate(['main/customer/customer-list']);
        },
        error: (error) => {
          this.isLoading = false;
          this.toastr.error(error.message);
        },
      });
    }
  }
}
