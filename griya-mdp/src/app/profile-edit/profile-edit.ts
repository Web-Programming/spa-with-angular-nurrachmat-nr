import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-edit.html',
  styleUrl: './profile-edit.css'
})
export class ProfileEdit implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  userData: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      location: [''],
      bio: [''],
      job: [''],
      birthdate: [''],
      status: ['']
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    // Get user data dari localStorage
    this.userData = this.authService.getUserData();
    
    if (!this.userData) {
      alert('Anda harus login terlebih dahulu');
      this.router.navigate(['/login']);
      return;
    }

    // Load profile dari backend menggunakan JWT token
    this.authService.getProfile().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.profileForm.patchValue(response.data);
        }
      },
      error: (error) => {
        console.error('Load profile error:', error);
        this.errorMessage = 'Gagal memuat data profil';
      }
    });
  }

  submitForm() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = this.profileForm.value;

      this.authService.updateProfile(formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = response.message || 'Profil berhasil diupdate';
          
          // Update localStorage dengan data baru
          const updatedUser = { ...this.userData, ...response.data };
          this.authService.saveUserData(updatedUser);
          
          // Redirect ke profile setelah 2 detik
          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Gagal mengupdate profil';
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/profile']);
  }
}
