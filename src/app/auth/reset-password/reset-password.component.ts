import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  loading = false;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    this.initForm();
  }
  private initForm(): void {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    if (
      this.form.invalid ||
      this.form.value.password !== this.form.value.confirmPassword
    ) {
      return;
    }
    if (this.form.valid) {
      this.loading = true;
      this.authService
        .resetPassword({
          token: this.token,
          newPassword: this.form.value.password,
        })
        .subscribe({
          next: (response) => {
            this.loading = false;
            this.toastr.success(
              'Password reset successfully. You can now log in.',
              'Success'
            );
            this.successMessage =
              'Password reset successfully. You can now log in.';
            //this.router.navigate(['/login']);
          },
          error: (error) => {
            this.loading = false;
            this.errorMessage = 'Something went wrong.';
            this.toastr.error('Something went wrong.', 'Error');
          },
        });
    }
  }
}
