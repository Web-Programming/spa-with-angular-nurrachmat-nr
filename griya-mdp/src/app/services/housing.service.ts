import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Housing } from '../lokasi-perumahan/housing.model';

@Injectable({
  providedIn: 'root'
})
export class HousingService {
  private apiUrl = 'http://localhost:3000/housing';
  
  constructor(private http: HttpClient) {}
  
  getAllHousing(): Observable<Housing[]> {
    return this.http.get<Housing[]>(this.apiUrl);
  }
  
  getHousingById(id: number): Observable<Housing> {
    return this.http.get<Housing>(`${this.apiUrl}/${id}`);
  }
  
  filterHousingByType(type: string): Observable<Housing[]> {
    return this.http.get<Housing[]>(`${this.apiUrl}?type=${type}`);
  }

  /**
   * Create new housing
   */
  createHousing(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  /**
   * Update housing
   */
  updateHousing(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Delete housing
   */
  deleteHousing(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get my housing (properties owned by current user)
   * Requires JWT token in Authorization header
   */
  getMyHousing(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my`);
  }
}