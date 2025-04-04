import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Investigator, InvestigatorRole } from '../../core/models/investigator.model';
import { InvestigatorService } from '../../core/services/investigator.service';

@Component({
  selector: 'app-investigator-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="investigator-list">
      <div class="list-header">
        <h1>Clinical Trial Investigators</h1>
        <button class="btn-add" routerLink="/investigators/new">Add Investigator</button>
      </div>

      <div *ngIf="loading()" class="loading">
        Loading investigators...
      </div>

      <div *ngIf="error()" class="error-message">
        {{ error() }}
      </div>

      <div class="investigator-grid" *ngIf="investigators().length > 0">
        <div *ngFor="let investigator of investigators()" class="investigator-card">
          <div class="card-header">
            <h3>{{ investigator.firstName }} {{ investigator.lastName }}</h3>
            <span class="badge" [class.active]="investigator.isActive">
              {{ investigator.isActive ? 'Active' : 'Inactive' }}
            </span>
          </div>

          <div class="card-body">
            <div class="info-row">
              <span class="label">Email:</span>
              <a [href]="'mailto:' + investigator.email">{{ investigator.email }}</a>
            </div>
            <div class="info-row">
              <span class="label">Phone:</span>
              <span>{{ investigator.phone }}</span>
            </div>
            <div class="info-row">
              <span class="label">Role:</span>
              <span class="badge" [ngClass]="getRoleBadgeClass(investigator.role)">
                {{ investigator.role }}
              </span>
            </div>
            <div class="info-row">
              <span class="label">Specialization:</span>
              <span>{{ investigator.specialization || 'N/A' }}</span>
            </div>
          </div>

          <div class="card-footer">
            <button class="btn-primary" [routerLink]="['/investigators', investigator.id, 'edit']">
              Edit
            </button>
            <button class="btn-danger" (click)="deleteInvestigator(investigator.id)">
              Delete
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="!loading() && !error() && investigators().length === 0" class="no-data">
        No investigators found
      </div>
    </div>
  `,
  styles: [`
    .investigator-list {
      padding: 2rem;
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h1 {
        margin: 0;
      }
    }

    .investigator-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .investigator-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;

      .card-header {
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: start;
        border-bottom: 1px solid #eee;

        h3 {
          margin: 0;
          font-size: 1.25rem;
        }
      }

      .card-body {
        padding: 1rem;
      }

      .card-footer {
        padding: 1rem;
        border-top: 1px solid #eee;
        display: flex;
        gap: 0.5rem;
      }
    }

    .info-row {
      display: flex;
      align-items: center;
      margin-bottom: 0.75rem;

      .label {
        width: 120px;
        color: #666;
        font-size: 0.875rem;
      }

      a {
        color: #2196f3;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 16px;
      font-size: 0.875rem;
      font-weight: 500;

      &.active {
        background: #e8f5e9;
        color: #2e7d32;
      }

      &:not(.active) {
        background: #ffebee;
        color: #c62828;
      }

      &.badge-principal {
        background: #e3f2fd;
        color: #1565c0;
      }

      &.badge-sub {
        background: #f3e5f5;
        color: #7b1fa2;
      }

      &.badge-coordinator {
        background: #e8f5e9;
        color: #2e7d32;
      }
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;

      &.btn-add {
        background: #2196f3;
        color: white;
      }

      &.btn-primary {
        background: #3498db;
        color: white;
      }

      &.btn-danger {
        background: #dc3545;
        color: white;
      }
    }

    .no-data {
      text-align: center;
      padding: 2rem;
      color: #666;
      font-style: italic;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .error-message {
      color: #dc3545;
      padding: 1rem;
      margin: 1rem 0;
      background: #f8d7da;
      border-radius: 4px;
    }
  `]
})
export class InvestigatorListComponent implements OnInit {
  investigators = signal<Investigator[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(private investigatorService: InvestigatorService) {}

  ngOnInit(): void {
    this.loadInvestigators();
  }

  getRoleBadgeClass(role: InvestigatorRole): string {
    switch (role) {
      case InvestigatorRole.PRINCIPAL:
        return 'badge-principal';
      case InvestigatorRole.SUB:
        return 'badge-sub';
      case InvestigatorRole.COORDINATOR:
        return 'badge-coordinator';
      default:
        return '';
    }
  }

  deleteInvestigator(id: number): void {
    if (confirm('Are you sure you want to delete this investigator?')) {
      this.loading.set(true);
      this.error.set(null);

      this.investigatorService.deleteInvestigator(id).subscribe({
        next: () => {
          this.loadInvestigators();
        },
        error: (error) => {
          console.error('Error deleting investigator:', error);
          this.error.set('Failed to delete investigator. Please try again later.');
          this.loading.set(false);
        }
      });
    }
  }

  private loadInvestigators(): void {
    this.loading.set(true);
    this.error.set(null);

    this.investigatorService.getInvestigators().subscribe({
      next: (investigators) => {
        this.investigators.set(investigators);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading investigators:', error);
        this.error.set('Failed to load investigators. Please try again later.');
        this.loading.set(false);
      }
    });
  }
} 