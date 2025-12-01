import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HousingService } from '../services/housing.service';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './property-form.html',
  styleUrl: './property-form.css'
})
export class PropertyForm implements OnInit {
  propertyForm: FormGroup;
  isEditMode = false;
  propertyId: number = 0;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private housingService: HousingService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.propertyForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      location: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      bedrooms: ['', [Validators.required, Validators.min(1)]],
      bathrooms: ['', [Validators.required, Validators.min(1)]],
      area: ['', [Validators.required, Validators.min(1)]],
      image: ['', Validators.required],
      status: ['Available', Validators.required],
      type: ['rumah', Validators.required],
      description: [''],
      rating: [0, [Validators.min(0), Validators.max(5)]]
    });
  }

  ngOnInit() {
    // Cek apakah edit mode
    this.route.params.subscribe(params => {
        this.propertyId = +params['id']; // + untuk convert string ke number
        console.log(this.propertyId);
        if (this.propertyId) {
            this.isEditMode = true;
            this.loadPropertyData();
        }
    });
    
  }

  loadPropertyData() {
    console.log(this.propertyId);
    
    if (!this.propertyId) return;

    this.housingService.getHousingById(this.propertyId).subscribe({
      next: (housing) => {
        this.propertyForm.patchValue(housing);
      },
      error: (error) => {
        console.error('Load error:', error);
        this.errorMessage = 'Gagal memuat data properti';
      }
    });
  }

  submitForm() {
    if (this.propertyForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = this.propertyForm.value;

      if (this.isEditMode && this.propertyId) {
        // Update
        this.housingService.updateHousing(this.propertyId, formData).subscribe({
          next: (response) => {
            this.isLoading = false;
            this.successMessage = response.message || 'Properti berhasil diupdate';
            setTimeout(() => this.router.navigate(['/profile']), 2000);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'Gagal update properti';
          }
        });
      } else {
        // Create
        this.housingService.createHousing(formData).subscribe({
          next: (response) => {
            this.isLoading = false;
            this.successMessage = response.message || 'Properti berhasil ditambahkan';
            this.propertyForm.reset();
            setTimeout(() => this.router.navigate(['/profile']), 2000);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'Gagal menambahkan properti';
          }
        });
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
