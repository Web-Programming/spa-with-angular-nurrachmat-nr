import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LokasiPerumahan } from '../lokasi-perumahan/lokasi-perumahan';
import { Housing } from '../lokasi-perumahan/housing.model';
import { CommonModule } from '@angular/common';
import { HOUSING_DATA } from '../data/housing-data';
import { FormsModule } from '@angular/forms';
import { HousingService } from '../services/housing';

@Component({
  selector: 'app-home',
  imports: [LokasiPerumahan, CommonModule, RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  // Array untuk data perumahan (bisa diisi dari backend nanti)
  housingList: Housing[] = HOUSING_DATA;
  filteredList: Housing[] = [];

  // State management
  isLoading: boolean = false;         // Loading state
  errorMessage: string = '';          // Error message
  selectedFilter: string = 'all';

  // Pagination
  currentPage: number = 1;            // Halaman saat ini
  itemsPerPage: number = 6;           // Items per halaman

  private fallbackData: Housing[] = HOUSING_DATA;

  constructor(private housingService:HousingService){

  }

  ngOnInit() {
    // Initialize filtered list with all housing
    //this.filteredList = [...this.housingList];
    this.loadHousingData();
  }

  loadHousingData() {
    this.isLoading = true;
    this.errorMessage = '';

    this.housingService.getAllHousing().subscribe({
      next: (data) => {
        this.housingList = data;
        this.filteredList = data;
        this.isLoading = false;
        console.log('Data berhasil dimuat dari backend:', data);
      },
      error: (err) => {
        console.error('Error loading housing data:', err);
        // Gunakan data fallback
        this.housingList = this.fallbackData;
        this.filteredList = this.fallbackData;
        this.isLoading = false;
        this.errorMessage = 'Menggunakan data demo (backend tidak tersedia)';
      }
    });
  }

  // Computed property untuk data yang ditampilkan (paginated)
  get paginatedList(): Housing[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredList.slice(start, start + this.itemsPerPage);
  }

  // Total halaman
  get totalPages(): number {
    return Math.ceil(this.filteredList.length / this.itemsPerPage);
  }

  // Array untuk loop pagination buttons
  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Index awal item di halaman ini
  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  // Index akhir item di halaman ini
  get endIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredList.length);
  }

  // Pindah ke halaman tertentu
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // Smooth scroll ke section
      document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Halaman berikutnya
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  // Halaman sebelumnya
  previousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }
  

  filterByType(type: string) {
    this.selectedFilter = type;
    if (type === 'all') {
      this.filteredList = [...this.housingList];
    } else {
      this.filteredList = this.housingList.filter(h => h.type === type);
    }
  }

  isFilterActive(type: string): boolean {
    return this.selectedFilter === type;
  }
}
