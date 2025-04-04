import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Portfolio, PortfolioCategory } from '../../core/models/portfolio.model';
import { PortfolioService } from '../../core/services/portfolio.service';

@Component({
  selector: 'app-portfolio-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="portfolio-list">
      <header class="list-header">
        <h1>Clinical Trial Portfolios</h1>
        <button class="btn-primary" routerLink="/portfolios/new">Add New Portfolio</button>
      </header>

      <div class="filters">
        <div class="category-filters">
          <button
            *ngFor="let category of categories"
            class="filter-btn"
            [class.active]="selectedCategory() === category"
            (click)="filterByCategory(category)"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <div *ngIf="loading()" class="loading">
        Loading portfolios...
      </div>

      <div *ngIf="error()" class="error-message">
        {{ error() }}
      </div>

      <div class="portfolio-grid" *ngIf="!loading() && !error()">
        <div *ngFor="let portfolio of portfolios()" class="portfolio-card">
          <div class="card-header">
            <h3>{{ portfolio.title }}</h3>
            <span class="category-badge">{{ portfolio.category }}</span>
          </div>
          
          <p class="description">{{ portfolio.description }}</p>
          
          <div class="progress-section">
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="portfolio.progress"></div>
            </div>
            <span class="progress-text">{{ portfolio.progress }}%</span>
          </div>

          <div class="tags" *ngIf="portfolio.tags?.length">
            <span class="tag" *ngFor="let tag of portfolio.tags">{{ tag }}</span>
          </div>

          <div class="card-actions">
            <button class="btn-secondary" [routerLink]="['/portfolios', portfolio.id]">
              View Details
            </button>
            <button class="btn-primary" [routerLink]="['/portfolios', portfolio.id, 'edit']">
              Edit
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="!loading() && !error() && portfolios().length === 0" class="empty-state">
        No portfolios found. Create your first portfolio to get started.
      </div>
    </div>
  `,
  styles: [`
    .portfolio-list {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .filters {
      margin-bottom: 20px;
    }

    .category-filters {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: 8px 16px;
      border: 1px solid #ddd;
      border-radius: 20px;
      background: white;
      cursor: pointer;
      transition: all 0.2s;

      &.active {
        background: #007bff;
        color: white;
        border-color: #007bff;
      }
    }

    .portfolio-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .portfolio-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;

      h3 {
        margin: 0;
        font-size: 1.25rem;
      }
    }

    .category-badge {
      background: #e9ecef;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .description {
      color: #6c757d;
      margin-bottom: 15px;
    }

    .progress-section {
      margin-bottom: 15px;
    }

    .progress-bar {
      height: 8px;
      background: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 5px;
    }

    .progress-fill {
      height: 100%;
      background: #28a745;
      transition: width 0.3s ease;
    }

    .progress-text {
      font-size: 0.875rem;
      color: #6c757d;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 15px;
    }

    .tag {
      background: #f8f9fa;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .card-actions {
      display: flex;
      gap: 10px;
    }

    .btn-primary {
      background: #007bff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background: #0056b3;
      }
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background: #5a6268;
      }
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: #6c757d;
    }

    .error-message {
      color: #dc3545;
      text-align: center;
      padding: 20px;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #6c757d;
    }
  `]
})
export class PortfolioListComponent implements OnInit {
  portfolios = signal<Portfolio[]>([]);
  selectedCategory = signal<PortfolioCategory | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  categories = Object.values(PortfolioCategory);

  constructor(private portfolioService: PortfolioService) {
    // Effect to automatically reload portfolios when category changes
    effect(() => {
      this.loadPortfolios(this.selectedCategory());
    });
  }

  ngOnInit(): void {
    this.loadPortfolios(null);
  }

  filterByCategory(category: PortfolioCategory | null): void {
    this.selectedCategory.set(category);
  }

  private loadPortfolios(category: PortfolioCategory | null): void {
    this.loading.set(true);
    this.error.set(null);

    const request = category
      ? this.portfolioService.getPortfoliosByCategory(category)
      : this.portfolioService.getPortfolios();

    request.subscribe({
      next: (portfolios) => {
        this.portfolios.set(portfolios);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading portfolios:', error);
        this.error.set('Failed to load portfolios. Please try again later.');
        this.loading.set(false);
      }
    });
  }
} 