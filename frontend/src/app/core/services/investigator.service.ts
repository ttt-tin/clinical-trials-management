import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Investigator, CreateInvestigatorDto, UpdateInvestigatorDto } from '../models/investigator.model';

@Injectable({
  providedIn: 'root'
})
export class InvestigatorService {
  private basePath = 'investigators';

  constructor(private api: ApiService) {}

  /**
   * Get all investigators
   */
  getInvestigators(): Observable<Investigator[]> {
    return this.api.get<Investigator[]>(this.basePath);
  }

  /**
   * Get investigators by portfolio ID
   * @param portfolioId - Portfolio ID
   */
  getInvestigatorsByPortfolio(portfolioId: number): Observable<Investigator[]> {
    return this.api.get<Investigator[]>(this.api.formatPath(this.basePath, 'portfolio', portfolioId.toString()));
  }

  /**
   * Get an investigator by ID
   * @param id - Investigator ID
   */
  getInvestigator(id: number): Observable<Investigator> {
    return this.api.get<Investigator>(this.api.formatPath(this.basePath, id.toString()));
  }

  /**
   * Create a new investigator
   * @param investigator - Investigator data
   */
  createInvestigator(investigator: CreateInvestigatorDto): Observable<Investigator> {
    return this.api.post<Investigator>(this.basePath, investigator);
  }

  /**
   * Update an existing investigator
   * @param id - Investigator ID
   * @param investigator - Updated investigator data
   */
  updateInvestigator(id: number, investigator: UpdateInvestigatorDto): Observable<Investigator> {
    return this.api.patch<Investigator>(this.api.formatPath(this.basePath, id.toString()), investigator);
  }

  /**
   * Delete an investigator
   * @param id - Investigator ID
   */
  deleteInvestigator(id: number): Observable<void> {
    return this.api.delete<void>(this.api.formatPath(this.basePath, id.toString()));
  }
} 