import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule,
    FormsModule,
     ReactiveFormsModule]
})

export class LoginComponent {
  userName = '';
  password = '';
  isSubmitted = false; 
  isLoading = false; 
  loginForm: FormGroup;

  constructor(private authService: AuthService, private router: Router,private fb: FormBuilder,private toastr: ToastrService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }
    onSubmit() {
      this.isSubmitted = true; 
      if (this.loginForm.valid) {
        this.isLoading=true;
        this.authService.login({ userName: this.loginForm.value.username, password:this.loginForm.value.password }).subscribe({
          next: (response) => {
            this.isLoading = false;
            this.toastr.success('Login successful!', 'Success');
            this.router.navigate(['/main'])
          },
          error: (error) => {
            this.isLoading = false;
            this.toastr.error('Login failed. Please try again.', 'Error');  
          }
        });
      }
}
}
