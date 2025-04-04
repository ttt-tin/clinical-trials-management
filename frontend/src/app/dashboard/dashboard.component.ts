import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Portfolio, PortfolioCategory } from '../core/models/portfolio.model';
import { PortfolioService } from '../core/services/portfolio.service';

interface PortfolioStats {
  total: number;
  active: number;
  averageProgress: number;
  progressDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  categoryDistribution: Record<PortfolioCategory, number>;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1>Project Overview</h1>

      <div *ngIf="loading()" class="loading">
        Loading data...
      </div>

      <div *ngIf="error()" class="error">
        {{ error() }}
      </div>

      <div *ngIf="stats()" class="stats-grid">
        <div class="stat-card">
          <h3>Total Projects</h3>
          <p class="stat">{{ stats()?.total || 0 }}</p>
        </div>

        <div class="stat-card">
          <h3>Active Projects</h3>
          <p class="stat">{{ stats()?.active || 0 }}</p>
        </div>

        <div class="stat-card">
          <h3>Average Progress</h3>
          <p class="stat">{{ stats()?.averageProgress || 0 }}%</p>
        </div>

        <div class="stat-card wide">
          <h3>Progress Distribution</h3>
          <div class="progress-bars">
            <div class="progress-item">
              <label>Low (<33%)</label>
              <div class="progress-bar">
                <div class="progress" [style.width.%]="getProgressWidth('low')"></div>
              </div>
              <span>{{ getProgressValue('low') }}</span>
            </div>
            <div class="progress-item">
              <label>Medium (33-66%)</label>
              <div class="progress-bar">
                <div class="progress" [style.width.%]="getProgressWidth('medium')"></div>
              </div>
              <span>{{ getProgressValue('medium') }}</span>
            </div>
            <div class="progress-item">
              <label>High (>66%)</label>
              <div class="progress-bar">
                <div class="progress" [style.width.%]="getProgressWidth('high')"></div>
              </div>
              <span>{{ getProgressValue('high') }}</span>
            </div>
          </div>
        </div>

        <div class="stat-card wide">
          <h3>Phase Distribution</h3>
          <div class="phase-grid">
            <div *ngFor="let category of categories" class="phase-item">
              <h4>{{ category }}</h4>
              <p>{{ getCategoryValue(category) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-top: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);

      &.wide {
        grid-column: span 3;
      }

      h3 {
        margin: 0 0 1rem;
        color: #666;
        font-size: 1rem;
      }

      .stat {
        font-size: 2rem;
        font-weight: 600;
        margin: 0;
        color: #2c3e50;
      }
    }

    .progress-bars {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .progress-item {
      display: grid;
      grid-template-columns: 120px 1fr 40px;
      align-items: center;
      gap: 1rem;

      label {
        font-size: 0.875rem;
        color: #666;
      }
    }

    .progress-bar {
      height: 8px;
      background: #eee;
      border-radius: 4px;
      overflow: hidden;

      .progress {
        height: 100%;
        background: #3498db;
        transition: width 0.3s ease;
      }
    }

    .phase-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;

      .phase-item {
        text-align: center;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 6px;

        h4 {
          margin: 0 0 0.5rem;
          color: #666;
          font-size: 0.875rem;
        }

        p {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: #2c3e50;
        }
      }
    }

    .error {
      color: #dc3545;
      padding: 1rem;
      margin: 1rem 0;
      background: #f8d7da;
      border-radius: 4px;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private portfolios = signal<Portfolio[]>([]);
  stats = signal<PortfolioStats | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  categories = Object.values(PortfolioCategory);

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.loadPortfolios();
  }

  getProgressWidth(type: 'low' | 'medium' | 'high'): number {
    const stats = this.stats();
    if (!stats) return 0;
    return (stats.progressDistribution[type] / stats.total) * 100;
  }

  getProgressValue(type: 'low' | 'medium' | 'high'): number {
    const stats = this.stats();
    return stats?.progressDistribution?.[type] || 0;
  }

  getCategoryValue(category: PortfolioCategory): number {
    const stats = this.stats();
    return stats?.categoryDistribution?.[category] || 0;
  }

  private loadPortfolios(): void {
    this.loading.set(true);
    this.error.set(null);

    this.portfolioService.getPortfolios().subscribe({
      next: (portfolios) => {
        this.portfolios.set(portfolios);
        this.calculateStats(portfolios);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading portfolios:', error);
        this.error.set('Failed to load portfolio data. Please try again later.');
        this.loading.set(false);
      }
    });
  }

  private calculateStats(portfolios: Portfolio[]): void {
    const stats: PortfolioStats = {
      total: portfolios.length,
      active: portfolios.filter(p => p.isActive).length,
      averageProgress: Math.round(
        portfolios.reduce((sum, p) => sum + p.progress, 0) / portfolios.length || 0
      ),
      progressDistribution: {
        low: portfolios.filter(p => p.progress < 33).length,
        medium: portfolios.filter(p => p.progress >= 33 && p.progress < 66).length,
        high: portfolios.filter(p => p.progress >= 66).length
      },
      categoryDistribution: this.categories.reduce((acc, category) => {
        acc[category] = portfolios.filter(p => p.category === category).length;
        return acc;
      }, {} as Record<PortfolioCategory, number>)
    };

    this.stats.set(stats);
  }
} 