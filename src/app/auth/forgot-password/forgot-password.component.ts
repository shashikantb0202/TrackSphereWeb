import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  submitted = false;
  successMessage = '';
  errorMessage = '';
  form!: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.initForm();
  }
  private initForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';
    this.submitted = true;
    if (this.form.valid) {
      this.isLoading = true;
      this.authService
        .forgotPassword({
          Email: this.form.value.email,
        })
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            this.toastr.success(
              'Password reset link sent to your email.',
              'Success'
            );
            this.successMessage = 'Password reset link sent to your email.';
            //this.router.navigate(['/login']);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = 'Email not found. Please try again.';
            this.toastr.error('Email not found. Please try again.', 'Error');
          },
        });
    }
  }
}
