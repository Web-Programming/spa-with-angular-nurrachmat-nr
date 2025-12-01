import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProfileHeaderComponent } from './components/profile-header/profile-header';
import { StatsCardComponent } from './components/stats-card/stats-card';
import { AboutCardComponent } from './components/about-card/about-card';
import { SocialCardComponent } from './components/social-card/social-card';
import { PropertyItemComponent } from './components/property-item/property-item';
import { FavoriteItemComponent } from './components/favorite-item/favorite-item';
import { HistoryItemComponent } from './components/history-item/history-item';
import { UserProfile, StatsSummary, PropertyItem, FavoriteItem, HistoryItem, SocialLinks } from './profile.models';
import { HousingService } from '../services/housing.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ProfileHeaderComponent,
    StatsCardComponent,
    AboutCardComponent,
    SocialCardComponent,
    PropertyItemComponent,
    FavoriteItemComponent,
    HistoryItemComponent
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  constructor(
    private housingService: HousingService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUserProfile();
    this.loadMyProperties();
  }

  loadUserProfile() {
    this.authService.getProfile().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const userData = response.data as any;
          this.user = {
            name: userData.name || 'User',
            email: userData.email || '',
            phone: userData.phone || '',
            location: userData.location || '',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&size=150&background=667eea&color=fff&bold=true`,
            isPremium: false,
            isVerified: true,
            memberSince: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) : 'Baru',
            bio: userData.bio || '',
            job: userData.job || '',
            birthdate: userData.birthdate || '',
            status: userData.status || ''
          };
        }
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
      }
    });
  }

  loadMyProperties() {
    this.housingService.getMyHousing().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.properties = response.data.map((housing: any) => ({
            id: housing.id,
            title: housing.title,
            location: housing.location,
            price: housing.price,
            image: housing.image,
            bedrooms: housing.bedrooms,
            bathrooms: housing.bathrooms,
            area: housing.area,
            status: housing.status
          }));
          this.stats.properties = this.properties.length;
        }
      },
      error: (error) => {
        console.error('Error loading properties:', error);
      }
    });
  }

  user: UserProfile = {
    name: '',
    email: '',
    phone: '',
    location: '',
    avatar: '',
    isPremium: false,
    isVerified: true,
    memberSince: '',
    bio: '',
    job: '',
    birthdate: '',
    status: ''
  };

  stats: StatsSummary = {
    properties: 3,
    favorites: 12,
    rating: 4.8,
    memberSince: 'Jan 2024'
  };

  socialLinks: SocialLinks = {
    facebook: '#',
    twitter: '#',
    instagram: '#',
    linkedin: '#'
  };

  properties: PropertyItem[] = [
    {
      id: 1,
      title: 'Modern Apartment',
      location: 'Jakarta Selatan',
      price: 5000000,
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop',
      bedrooms: 2,
      bathrooms: 1,
      area: 45,
      status: 'Active'
    },
    {
      id: 2,
      title: 'Luxury House',
      location: 'Jakarta Pusat',
      price: 15000000,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=250&fit=crop',
      bedrooms: 4,
      bathrooms: 3,
      area: 120,
      status: 'Pending'
    },
    {
      id: 3,
      title: 'Cozy Studio',
      location: 'Jakarta Barat',
      price: 3500000,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=250&fit=crop',
      bedrooms: 1,
      bathrooms: 1,
      area: 30,
      status: 'Active'
    }
  ];

  favorites: FavoriteItem[] = [
    {
      id: 101,
      title: 'Beautiful Villa',
      location: 'Bali, Indonesia',
      price: 20000000,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=250&fit=crop',
      bedrooms: 5,
      bathrooms: 4,
      area: 200,
      rating: 4.9
    },
    {
      id: 102,
      title: 'Urban Loft',
      location: 'Jakarta Utara',
      price: 8000000,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=250&fit=crop',
      bedrooms: 2,
      bathrooms: 2,
      area: 80,
      rating: 4.7
    }
  ];

  history: HistoryItem[] = [
    {
      icon: 'bi-check-circle-fill',
      iconColor: 'success',
      title: 'Pembayaran Berhasil',
      description: 'Modern Apartment - November 2024',
      time: '2 hari yang lalu',
      badge: 'Rp 5.000.000',
      badgeColor: 'success'
    },
    {
      icon: 'bi-house-fill',
      iconColor: 'primary',
      title: 'Properti Ditambahkan',
      description: 'Cozy Studio telah terdaftar',
      time: '5 hari yang lalu',
      badge: 'Properti Baru',
      badgeColor: 'primary'
    },
    {
      icon: 'bi-pencil-fill',
      iconColor: 'info',
      title: 'Profile Diperbarui',
      description: 'Informasi kontak dan foto profil',
      time: '1 minggu yang lalu',
      badge: 'Update',
      badgeColor: 'info'
    },
    {
      icon: 'bi-star-fill',
      iconColor: 'warning',
      title: 'Review Diterima',
      description: 'Luxury House - Rating 5.0',
      time: '2 minggu yang lalu',
      badge: 'Review',
      badgeColor: 'warning'
    }
  ];

  onEditProfile() {
    this.router.navigate(['/profile/edit']);
  }

  onSettings() {
    console.log('Settings clicked');
    // Navigate to settings page
  }

  onEditProperty(propertyId: number) {
    this.router.navigate(['/property/edit', propertyId]);
  }

  onDeleteProperty(propertyId: number) {
    if (confirm('Yakin ingin menghapus properti ini?')) {
      this.housingService.deleteHousing(propertyId).subscribe({
        next: (response) => {
          console.log('Property deleted:', response);
          // Reload properties after delete
          this.loadMyProperties();
        },
        error: (error) => {
          console.error('Error deleting property:', error);
          alert('Gagal menghapus properti: ' + (error.error?.message || 'Terjadi kesalahan'));
        }
      });
    }
  }
}
