import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Portfolio, CreatePortfolioDto, UpdatePortfolioDto, PortfolioCategory } from '../models/portfolio.model';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private readonly basePath = 'portfolios';

  constructor(private api: ApiService) {}

  /**
   * Get all portfolios
   */
  getPortfolios(): Observable<Portfolio[]> {
    return this.api.get<Portfolio[]>(this.basePath);
  }

  /**
   * Get a portfolio by ID
   * @param id - Portfolio ID
   */
  getPortfolio(id: number): Observable<Portfolio> {
    return this.api.get<Portfolio>(this.api.formatPath(this.basePath, id.toString()));
  }

  /**
   * Create a new portfolio
   * @param portfolio - Portfolio data
   */
  createPortfolio(portfolio: CreatePortfolioDto): Observable<Portfolio> {
    return this.api.post<Portfolio>(this.basePath, portfolio);
  }

  /**
   * Update an existing portfolio
   * @param id - Portfolio ID
   * @param portfolio - Updated portfolio data
   */
  updatePortfolio(id: number, portfolio: UpdatePortfolioDto): Observable<Portfolio> {
    return this.api.patch<Portfolio>(this.api.formatPath(this.basePath, id.toString()), portfolio);
  }

  /**
   * Delete a portfolio
   * @param id - Portfolio ID
   */
  deletePortfolio(id: number): Observable<void> {
    return this.api.delete<void>(this.api.formatPath(this.basePath, id.toString()));
  }

  /**
   * Get active portfolios
   */
  getActivePortfolios(): Observable<Portfolio[]> {
    return this.api.get<Portfolio[]>(this.api.formatPath(this.basePath, 'active'));
  }

  /**
   * Get portfolios by category
   * @param category - Portfolio category
   */
  getPortfoliosByCategory(category: PortfolioCategory): Observable<Portfolio[]> {
    return this.api.get<Portfolio[]>(this.api.formatPath(this.basePath, 'category', category));
  }
} 