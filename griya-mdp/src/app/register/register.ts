import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators, FormBuilder, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})

export class Register {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    },
    {validators: this.passwordMatchValidator });
  }

  // Custom validator untuk password match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { mismatch: true };
  }

  submitRegister(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      const formData = this.registerForm.value;

      // Kirim data ke backend API melalui AuthService
      this.authService.register(formData)
        .subscribe({
          next: (response) => {
            console.log('Registration successful', response);
            this.isLoading = false;
            this.successMessage = response.message || 'Registrasi berhasil! Silakan login';
            this.registerForm.reset();
            
            // Auto hide success message after 5 seconds
            setTimeout(() => {
              this.successMessage = '';
            }, 5000);
          },
          error: (error) => {
            console.error('Registration failed', error);
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'Registrasi gagal. Silakan coba lagi';
            
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
