import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PortfolioService } from '../../services/portfolio.service';
import { Portfolio } from '../../models/portfolio.model';

@Component({
  selector: 'app-portfolio-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TableModule,
    ButtonModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="grid">
      <div class="col-12">
        <div class="flex justify-content-between align-items-center mb-4">
          <h1 class="text-4xl font-bold m-0">Portfolios</h1>
          <p-button
            label="New Portfolio"
            icon="pi pi-plus"
            routerLink="/portfolios/new"
            styleClass="p-button-success"
          ></p-button>
        </div>

        <p-table
          [value]="portfolios"
          [paginator]="true"
          [rows]="10"
          [showCurrentPageReport]="true"
          [rowsPerPageOptions]="[10, 25, 50]"
          [loading]="loading"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} portfolios"
          [globalFilterFields]="['name', 'category', 'status']"
          styleClass="p-datatable-gridlines"
        >
          <ng-template pTemplate="caption">
            <div class="flex justify-content-between align-items-center">
              <h5 class="m-0">Manage Portfolios</h5>
              <span class="p-input-icon-left">
                <i class="pi pi-search"></i>
                <input
                  pInputText
                  type="text"
                  #filter
                  (input)="onGlobalFilter($event)"
                  placeholder="Search portfolios..."
                />
              </span>
            </div>
          </ng-template>

          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="name">Name <p-sortIcon field="name"></p-sortIcon></th>
              <th pSortableColumn="category">Category <p-sortIcon field="category"></p-sortIcon></th>
              <th pSortableColumn="status">Status <p-sortIcon field="status"></p-sortIcon></th>
              <th pSortableColumn="investigatorCount">Investigators <p-sortIcon field="investigatorCount"></p-sortIcon></th>
              <th pSortableColumn="trialCount">Trials <p-sortIcon field="trialCount"></p-sortIcon></th>
              <th style="width: 8rem">Actions</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-portfolio>
            <tr>
              <td>
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-folder text-primary"></i>
                  <span class="font-medium">{{ portfolio.name }}</span>
                </div>
              </td>
              <td>
                <span class="text-900">{{ portfolio.category }}</span>
              </td>
              <td>
                <p-tag
                  [value]="portfolio.status"
                  [severity]="getStatusSeverity(portfolio.status)"
                ></p-tag>
              </td>
              <td>
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-users text-primary"></i>
                  <span>{{ portfolio.investigatorCount || 0 }}</span>
                </div>
              </td>
              <td>
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-file text-primary"></i>
                  <span>{{ portfolio.trialCount || 0 }}</span>
                </div>
              </td>
              <td>
                <div class="flex gap-2">
                  <p-button
                    icon="pi pi-pencil"
                    styleClass="p-button-rounded p-button-text"
                    [routerLink]="['/portfolios', portfolio.id, 'edit']"
                  ></p-button>
                  <p-button
                    icon="pi pi-trash"
                    styleClass="p-button-rounded p-button-text p-button-danger"
                    (onClick)="confirmDelete(portfolio)"
                  ></p-button>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="6" class="text-center p-4">
                <div class="flex flex-column align-items-center">
                  <i class="pi pi-folder-open text-6xl text-500 mb-4"></i>
                  <span class="text-xl text-500">No portfolios found</span>
                  <p-button
                    label="Create New Portfolio"
                    icon="pi pi-plus"
                    styleClass="p-button-success mt-4"
                    routerLink="/portfolios/new"
                  ></p-button>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>

    <p-toast></p-toast>
    <p-confirmDialog
      header="Confirm Deletion"
      icon="pi pi-exclamation-triangle"
      acceptButtonStyleClass="p-button-danger"
      acceptIcon="pi pi-trash"
      rejectIcon="pi pi-times"
    ></p-confirmDialog>
  `,
  styles: [`
    :host {
      display: block;
      padding: 2rem;
    }

    ::ng-deep {
      .p-datatable {
        .p-datatable-header {
          background: transparent;
          padding: 1.5rem;
        }

        .p-datatable-thead > tr > th {
          background: var(--surface-ground);
        }

        .p-datatable-tbody > tr {
          transition: background-color 0.2s;

          &:hover {
            background: var(--surface-hover);
          }
        }

        .p-button.p-button-text {
          padding: 0.5rem;

          &:hover {
            background: var(--surface-ground);
          }
        }
      }
    }
  `]
})
export class PortfolioListComponent implements OnInit {
  private portfolioService = inject(PortfolioService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  portfolios: Portfolio[] = [];
  loading = true;

  ngOnInit() {
    this.loadPortfolios();
  }

  private loadPortfolios() {
    this.loading = true;
    this.portfolioService.getPortfolios().subscribe(
      (data) => {
        this.portfolios = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading portfolios:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load portfolios. Please try again later.'
        });
        this.loading = false;
      }
    );
  }

  getStatusSeverity(status: string): string {
    const severityMap: { [key: string]: string } = {
      'ACTIVE': 'success',
      'INACTIVE': 'warning',
      'COMPLETED': 'info',
      'ARCHIVED': 'secondary'
    };
    return severityMap[status] || 'info';
  }

  onGlobalFilter(event: Event) {
    const table = document.querySelector('p-table');
    if (table) {
      const filterValue = (event.target as HTMLInputElement).value;
      (table as any).filterGlobal(filterValue, 'contains');
    }
  }

  confirmDelete(portfolio: Portfolio) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the portfolio "${portfolio.name}"?`,
      accept: () => {
        this.portfolioService.deletePortfolio(portfolio.id).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Portfolio deleted successfully'
            });
            this.loadPortfolios();
          },
          (error) => {
            console.error('Error deleting portfolio:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete portfolio. Please try again.'
            });
          }
        );
      }
    });
  }
} 