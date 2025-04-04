import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TrialService } from '../../services/trial.service';
import { Trial } from '../../models/trial.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ChartModule, TableModule, TagModule],
  template: `
    <div class="grid">
      <div class="col-12">
        <h1 class="text-4xl font-bold mb-4">Dashboard</h1>
      </div>

      <!-- Stats Cards -->
      <div class="col-12 md:col-6 lg:col-3">
        <p-card styleClass="h-full">
          <div class="flex flex-column gap-2">
            <span class="text-500">Total Trials</span>
            <span class="text-3xl font-bold">{{ trials?.length || 0 }}</span>
            <span class="text-sm text-green-500">+12% from last month</span>
          </div>
        </p-card>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <p-card styleClass="h-full">
          <div class="flex flex-column gap-2">
            <span class="text-500">Active Trials</span>
            <span class="text-3xl font-bold">{{ getActiveTrialsCount() }}</span>
            <span class="text-sm text-green-500">+5% from last month</span>
          </div>
        </p-card>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <p-card styleClass="h-full">
          <div class="flex flex-column gap-2">
            <span class="text-500">Completed Trials</span>
            <span class="text-3xl font-bold">{{ getCompletedTrialsCount() }}</span>
            <span class="text-sm text-blue-500">On track</span>
          </div>
        </p-card>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <p-card styleClass="h-full">
          <div class="flex flex-column gap-2">
            <span class="text-500">Success Rate</span>
            <span class="text-3xl font-bold">{{ getSuccessRate() }}%</span>
            <span class="text-sm text-yellow-500">+2% from last month</span>
          </div>
        </p-card>
      </div>

      <!-- Recent Trials Table -->
      <div class="col-12">
        <p-card header="Recent Trials" styleClass="h-full">
          <p-table [value]="trials || []" [rows]="5" [paginator]="true" responsiveLayout="scroll">
            <ng-template pTemplate="header">
              <tr>
                <th>Trial ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Progress</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-trial>
              <tr>
                <td>{{ trial.id }}</td>
                <td>{{ trial.title }}</td>
                <td>
                  <p-tag [severity]="getStatusSeverity(trial.status)" [value]="trial.status"></p-tag>
                </td>
                <td>{{ trial.startDate | date }}</td>
                <td>{{ trial.endDate | date }}</td>
                <td>{{ calculateProgress(trial) }}%</td>
              </tr>
            </ng-template>
          </p-table>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    ::ng-deep {
      .p-card {
        height: 100%;
        
        .p-card-body {
          padding: 1.5rem;
        }
      }

      .p-datatable {
        .p-datatable-header {
          background: transparent;
          border: none;
          padding: 0 0 1rem 0;
        }

        .p-datatable-thead > tr > th {
          background: var(--surface-ground);
          border: none;
          padding: 1rem;
        }

        .p-datatable-tbody > tr > td {
          border: none;
          padding: 1rem;
        }

        .p-paginator {
          background: transparent;
          border: none;
          padding: 1rem 0 0 0;
        }
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private trialService = inject(TrialService);
  trials: Trial[] | null = null;

  ngOnInit() {
    this.loadTrials();
  }

  private loadTrials() {
    this.trialService.getTrials().subscribe(
      (data) => {
        this.trials = data;
      },
      (error) => {
        console.error('Error loading trials:', error);
      }
    );
  }

  getActiveTrialsCount(): number {
    return this.trials?.filter(trial => trial.status === 'ACTIVE').length || 0;
  }

  getCompletedTrialsCount(): number {
    return this.trials?.filter(trial => trial.status === 'COMPLETED').length || 0;
  }

  getSuccessRate(): number {
    if (!this.trials?.length) return 0;
    const completed = this.getCompletedTrialsCount();
    return Math.round((completed / this.trials.length) * 100);
  }

  getStatusSeverity(status: string): string {
    const severityMap: { [key: string]: string } = {
      'ACTIVE': 'success',
      'COMPLETED': 'info',
      'SUSPENDED': 'warning',
      'TERMINATED': 'danger'
    };
    return severityMap[status] || 'info';
  }

  calculateProgress(trial: Trial): number {
    if (!trial.startDate || !trial.endDate) return 0;
    
    const start = new Date(trial.startDate).getTime();
    const end = new Date(trial.endDate).getTime();
    const now = Date.now();

    if (now <= start) return 0;
    if (now >= end) return 100;

    const total = end - start;
    const current = now - start;
    return Math.round((current / total) * 100);
  }
} 