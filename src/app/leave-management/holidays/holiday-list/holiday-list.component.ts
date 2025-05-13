import { Component, OnInit, ViewChild } from '@angular/core';
import { Holiday } from '../../../Models/holiday.model';
import { HolidayService } from '../../../Services/holiday.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Modal } from 'bootstrap';
import { CommonModule, DatePipe } from '@angular/common';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-holiday-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    DateFormatPipe,
  ],
  providers: [DatePipe],
  templateUrl: './holiday-list.component.html',
  styleUrl: './holiday-list.component.css',
})
export class HolidayListComponent implements OnInit {
  holidays: Holiday[] = [];
  filteredHolidays: Holiday[] = [];
  selectedYear: number = new Date().getFullYear();
  years: number[] = [];

  // Form Management
  holidayForm: FormGroup;
  isSubmitted: boolean = false;
  isLoading: boolean = false;
  isSaving: boolean = false;

  // Inline Editing
  editHolidayId: number | null = null;
  editableHoliday: Partial<Holiday> = {};

  // Modal Instance
  holidayModalInstance: Modal | null = null;

  // Pagination Variables
  pageSize: number = 5;
  pageNumber: number = 0;
  totalRecords: number = 0;

  constructor(private holidayService: HolidayService, private fb: FormBuilder) {
    this.holidayForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      date: ['', Validators.required],
      year: [this.selectedYear, Validators.required],
      description: ['', Validators.required],
    });

    // Generate years array (current year ± 5 years)
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      this.years.push(i);
    }
  }

  // Open Add Holiday Modal
  openHolidayModal(): void {
    this.holidayForm.reset();
    this.holidayForm.patchValue({ year: this.selectedYear });
    this.editableHoliday = {} as Holiday;
    this.holidayModalInstance?.show();
  }

  ngOnInit(): void {
    this.loadHolidays();
    const modalElement = document.getElementById('holidayModal');
    if (modalElement) {
      this.holidayModalInstance = new Modal(modalElement);
    }
  }

  // Cancel Edit
  cancelEdit(): void {
    this.editHolidayId = null;
    this.editableHoliday = {};
    this.applyClientPagination();
  }

  // Load Holidays
  loadHolidays(): void {
    this.isLoading = true;
    this.holidayService.getHolidaysByYear(this.selectedYear).subscribe({
      next: (response) => {
        this.holidays = response;
        this.applyClientPagination();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading holidays:', error);
        this.isLoading = false;
      },
    });
  }

  // Apply Client-side Pagination
  applyClientPagination(): void {
    const start = this.pageNumber * this.pageSize;
    const end = start + this.pageSize;
    this.filteredHolidays = [...this.holidays].slice(start, end);
    this.totalRecords = this.holidays.length;
  }

  // Pagination Logic
  onPage(event: any): void {
    this.pageNumber = event.offset;
    this.applyClientPagination();
  }

  onSort(event: any): void {
    const sortColumn = event.sorts[0].prop as keyof Holiday;
    const sortDirection = event.sorts[0].dir;

    this.filteredHolidays.sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];

      if (valueA === undefined || valueA === null) return 1;
      if (valueB === undefined || valueB === null) return -1;

      if (
        sortColumn === 'date' &&
        typeof valueA === 'string' &&
        typeof valueB === 'string'
      ) {
        return sortDirection === 'asc'
          ? new Date(valueA).getTime() - new Date(valueB).getTime()
          : new Date(valueB).getTime() - new Date(valueA).getTime();
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return 0;
    });
  }

  // Edit Holiday
  editHoliday(holiday: Holiday): void {
    this.editHolidayId = holiday.id;
    this.editableHoliday = { ...holiday };
  }

  // Save Holiday
  saveHoliday(): void {
    if (!this.editableHoliday.id) return;

    this.isSaving = true;
    const holidayData = {
      id: this.editableHoliday.id,
      name: this.editableHoliday.name,
      date: this.editableHoliday.date,
      description: this.editableHoliday.description,
    };

    this.holidayService.updateHoliday(holidayData).subscribe({
      next: () => {
        const index = this.holidays.findIndex(
          (h) => h.id === this.editableHoliday.id
        );
        if (index !== -1)
          this.holidays[index] = { ...this.editableHoliday } as Holiday;
        this.isSaving = false;
        this.editHolidayId = null;
        this.loadHolidays();
      },
      error: (err) => {
        console.error('Error saving holiday:', err);
        this.isSaving = false;
      },
    });
  }

  // Save New Holiday
  saveNewHoliday(): void {
    this.isSubmitted = true;
    if (this.holidayForm.invalid) return;
    this.isSaving = true;

    this.holidayService.addHoliday(this.holidayForm.value).subscribe({
      next: (newHoliday) => {
        this.isSaving = false;
        this.editHolidayId = null;
        this.editableHoliday = {};
        this.holidayModalInstance?.hide();
        this.loadHolidays();
      },
      error: (err) => {
        console.error('Error adding holiday:', err);
        this.isSaving = false;
      },
    });
  }

  // Delete Holiday
  deleteHoliday(id: number): void {
    if (confirm('Are you sure you want to delete this holiday?')) {
      this.holidayService.deleteHoliday(id).subscribe({
        next: () => {
          this.loadHolidays();
        },
        error: (err) => {
          console.error('Error deleting holiday:', err);
        },
      });
    }
  }

  // Year Change Handler
  onYearChange(): void {
    this.loadHolidays();
  }

  // TrackBy for Improved Performance
  trackById(index: number, holiday: Holiday): number {
    return holiday.id;
  }
}
