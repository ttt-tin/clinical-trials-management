import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Portfolio } from './portfolio.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private apiUrl = `${environment.apiUrl}/portfolios`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Portfolio[]> {
    return this.http.get<Portfolio[]>(this.apiUrl);
  }

  getById(id: number): Observable<Portfolio> {
    return this.http.get<Portfolio>(`${this.apiUrl}/${id}`);
  }

  create(portfolio: Partial<Portfolio>): Observable<Portfolio> {
    return this.http.post<Portfolio>(this.apiUrl, portfolio);
  }

  update(id: number, portfolio: Partial<Portfolio>): Observable<Portfolio> {
    return this.http.patch<Portfolio>(`${this.apiUrl}/${id}`, portfolio);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getActive(): Observable<Portfolio[]> {
    return this.http.get<Portfolio[]>(`${this.apiUrl}/active`);
  }

  getByCategory(category: string): Observable<Portfolio[]> {
    return this.http.get<Portfolio[]>(`${this.apiUrl}/category/${category}`);
  }
} 