import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Housing } from './housing.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lokasi-perumahan',
  imports: [CommonModule, RouterLink],
  templateUrl: './lokasi-perumahan.html',
  styleUrl: './lokasi-perumahan.css',
})
export class LokasiPerumahan {
  @Input() housing!: Housing;

  getStars(): number[] {
    const fullStars = Math.floor(this.housing.rating);
    return Array(fullStars).fill(0);
  }

  hasHalfStar(): boolean {
    return this.housing.rating % 1 >= 0.5;
  }

  getEmptyStars(): number[] {
    const fullStars = Math.floor(this.housing.rating);
    const hasHalf = this.hasHalfStar() ? 1 : 0;
    const emptyStars = 5 - fullStars - hasHalf;
    return Array(emptyStars).fill(0);
  }
  
  // Format harga ke Rupiah
  formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  }
}
