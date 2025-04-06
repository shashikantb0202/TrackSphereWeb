import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DateFormats } from '../constants/date-formats';

@Pipe({
  name: 'dateFormat',
  standalone: true,
})
export class DateFormatPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(value: any, format: keyof typeof DateFormats = 'DEFAULT'): string {
    if (!value) return '';
    // Ensure the value is a valid date
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';
    return this.datePipe.transform(date, DateFormats[format]) || '';
  }
}
