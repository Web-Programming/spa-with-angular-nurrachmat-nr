import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submitLogin(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      const formData = this.loginForm.value;

      // Kirim data ke backend API melalui AuthService
      this.authService.login(formData)
        .subscribe({
          next: (response) => {
            console.log('Login successful', response);
            this.isLoading = false;
            this.successMessage = response.message || 'Login berhasil!';
            
            // Simpan user data ke localStorage
            if (response.data) {
              this.authService.saveUserData(response.data);
            }
            
            // Redirect ke home page setelah 1 detik
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 1000);
          },
          error: (error) => {
            console.error('Login failed', error);
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'Email atau password salah';
            
            // Auto hide error message after 5 seconds
            setTimeout(() => {
              this.errorMessage = '';
            }, 5000);
          }
        });
    } else {
      console.log('Form is not valid');
      this.errorMessage = 'Mohon lengkapi semua field dengan benar';
    }
  }
}
