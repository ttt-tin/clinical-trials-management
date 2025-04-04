import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-portfolio-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    InputTextareaModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="grid">
      <div class="col-12 md:col-8 md:col-offset-2 lg:col-6 lg:col-offset-3">
        <p-card>
          <ng-template pTemplate="title">
            <div class="flex align-items-center gap-2 mb-4">
              <i class="pi pi-folder-open text-xl"></i>
              <span class="text-xl font-semibold">{{ isEditMode ? 'Edit' : 'Create' }} Portfolio</span>
            </div>
          </ng-template>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-column gap-4">
            <div class="flex flex-column gap-2">
              <label for="name" class="font-medium">Name</label>
              <span class="p-input-icon-left w-full">
                <i class="pi pi-folder"></i>
                <input
                  id="name"
                  type="text"
                  pInputText
                  formControlName="name"
                  placeholder="Enter portfolio name"
                  class="w-full"
                />
              </span>
              <small class="text-red-500" *ngIf="form.get('name')?.errors?.['required'] && form.get('name')?.touched">
                Name is required
              </small>
            </div>

            <div class="flex flex-column gap-2">
              <label for="category" class="font-medium">Category</label>
              <p-dropdown
                id="category"
                [options]="categories"
                formControlName="category"
                placeholder="Select a category"
                [showClear]="true"
                styleClass="w-full"
              ></p-dropdown>
              <small class="text-red-500" *ngIf="form.get('category')?.errors?.['required'] && form.get('category')?.touched">
                Category is required
              </small>
            </div>

            <div class="flex flex-column gap-2">
              <label for="description" class="font-medium">Description</label>
              <textarea
                id="description"
                pInputTextarea
                formControlName="description"
                [rows]="5"
                placeholder="Enter portfolio description"
                class="w-full"
              ></textarea>
              <small class="text-red-500" *ngIf="form.get('description')?.errors?.['required'] && form.get('description')?.touched">
                Description is required
              </small>
            </div>

            <div class="flex flex-column gap-2">
              <label for="status" class="font-medium">Status</label>
              <p-dropdown
                id="status"
                [options]="statuses"
                formControlName="status"
                placeholder="Select a status"
                [showClear]="true"
                styleClass="w-full"
              ></p-dropdown>
              <small class="text-red-500" *ngIf="form.get('status')?.errors?.['required'] && form.get('status')?.touched">
                Status is required
              </small>
            </div>

            <div class="flex justify-content-end gap-2 mt-4">
              <p-button
                type="button"
                label="Cancel"
                icon="pi pi-times"
                styleClass="p-button-text"
                (onClick)="onCancel()"
              ></p-button>
              <p-button
                type="submit"
                [label]="isEditMode ? 'Update' : 'Create'"
                icon="pi pi-check"
                [loading]="submitting"
                [disabled]="!form.valid || submitting"
              ></p-button>
            </div>
          </form>
        </p-card>
      </div>
    </div>
    <p-toast></p-toast>
  `,
  styles: [`
    :host {
      display: block;
      padding: 2rem;
    }

    ::ng-deep {
      .p-card {
        .p-card-body {
          padding: 2rem;
        }
      }

      .p-inputtext,
      .p-dropdown {
        width: 100%;
      }

      .p-input-icon-left {
        width: 100%;

        i {
          left: 0.75rem;
          color: var(--text-color-secondary);
        }

        input {
          padding-left: 2.5rem;
        }
      }
    }
  `]
})
export class PortfolioFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private portfolioService = inject(PortfolioService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup;
  isEditMode = false;
  portfolioId: string | null = null;
  submitting = false;

  categories = [
    'Clinical Research',
    'Drug Development',
    'Medical Devices',
    'Biotechnology',
    'Healthcare Services'
  ];

  statuses = [
    'ACTIVE',
    'INACTIVE',
    'COMPLETED',
    'ARCHIVED'
  ];

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      category: [null, Validators.required],
      description: ['', Validators.required],
      status: ['ACTIVE', Validators.required]
    });

    this.portfolioId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.portfolioId;
  }

  ngOnInit() {
    if (this.isEditMode && this.portfolioId) {
      this.loadPortfolio(this.portfolioId);
    }
  }

  private loadPortfolio(id: string) {
    this.portfolioService.getPortfolio(id).subscribe(
      (portfolio) => {
        this.form.patchValue(portfolio);
      },
      (error) => {
        console.error('Error loading portfolio:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load portfolio. Please try again later.'
        });
        this.router.navigate(['/portfolios']);
      }
    );
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitting = true;
      const portfolio = this.form.value;

      const request = this.isEditMode
        ? this.portfolioService.updatePortfolio(this.portfolioId!, portfolio)
        : this.portfolioService.createPortfolio(portfolio);

      request.subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Portfolio ${this.isEditMode ? 'updated' : 'created'} successfully`
          });
          this.router.navigate(['/portfolios']);
        },
        (error) => {
          console.error('Error saving portfolio:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to ${this.isEditMode ? 'update' : 'create'} portfolio. Please try again.`
          });
          this.submitting = false;
        }
      );
    } else {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/portfolios']);
  }
} 