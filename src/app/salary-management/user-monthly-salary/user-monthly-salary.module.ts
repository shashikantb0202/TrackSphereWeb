import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserMonthlySalaryListComponent } from './user-monthly-salary-list/user-monthly-salary-list.component';
import { UserMonthlySalaryFormComponent } from './user-monthly-salary-form/user-monthly-salary-form.component';
import { UserMonthlySalaryViewComponent } from './user-monthly-salary-view/user-monthly-salary-view.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    UserMonthlySalaryListComponent,
    UserMonthlySalaryFormComponent,
    UserMonthlySalaryViewComponent,
  ],
})
export class UserMonthlySalaryModule {}
