import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InvestigatorService } from '../../services/investigator.service';
import { PortfolioService } from '../../services/portfolio.service';
import { Portfolio } from '../../models/portfolio.model';

@Component({
  selector: 'app-investigator-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    DropdownModule,
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
              <i class="pi pi-user-plus text-xl"></i>
              <span class="text-xl font-semibold">Add New Investigator</span>
            </div>
          </ng-template>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-column gap-4">
            <div class="flex flex-column gap-2">
              <label for="name" class="font-medium">Name</label>
              <span class="p-input-icon-left w-full">
                <i class="pi pi-user"></i>
                <input
                  id="name"
                  type="text"
                  pInputText
                  formControlName="name"
                  placeholder="Enter investigator name"
                  class="w-full"
                />
              </span>
              <small class="text-red-500" *ngIf="form.get('name')?.errors?.['required'] && form.get('name')?.touched">
                Name is required
              </small>
            </div>

            <div class="flex flex-column gap-2">
              <label for="email" class="font-medium">Email</label>
              <span class="p-input-icon-left w-full">
                <i class="pi pi-envelope"></i>
                <input
                  id="email"
                  type="email"
                  pInputText
                  formControlName="email"
                  placeholder="Enter email address"
                  class="w-full"
                />
              </span>
              <small class="text-red-500" *ngIf="form.get('email')?.errors?.['required'] && form.get('email')?.touched">
                Email is required
              </small>
              <small class="text-red-500" *ngIf="form.get('email')?.errors?.['email'] && form.get('email')?.touched">
                Please enter a valid email address
              </small>
            </div>

            <div class="flex flex-column gap-2">
              <label for="portfolio" class="font-medium">Portfolio</label>
              <p-dropdown
                id="portfolio"
                [options]="portfolios"
                formControlName="portfolioId"
                optionLabel="name"
                optionValue="id"
                [filter]="true"
                filterBy="name"
                placeholder="Select a portfolio"
                [showClear]="true"
                styleClass="w-full"
              >
                <ng-template pTemplate="selectedItem">
                  <div class="flex align-items-center gap-2" *ngIf="form.get('portfolioId')?.value">
                    <span>{{ getSelectedPortfolioName() }}</span>
                  </div>
                </ng-template>
                <ng-template let-portfolio pTemplate="item">
                  <div class="flex flex-column">
                    <span>{{ portfolio.name }}</span>
                    <small class="text-500">{{ portfolio.category }}</small>
                  </div>
                </ng-template>
              </p-dropdown>
              <small class="text-red-500" *ngIf="form.get('portfolioId')?.errors?.['required'] && form.get('portfolioId')?.touched">
                Portfolio is required
              </small>
            </div>

            <div class="flex flex-column gap-2">
              <label for="specialization" class="font-medium">Specialization</label>
              <span class="p-input-icon-left w-full">
                <i class="pi pi-briefcase"></i>
                <input
                  id="specialization"
                  type="text"
                  pInputText
                  formControlName="specialization"
                  placeholder="Enter specialization"
                  class="w-full"
                />
              </span>
              <small class="text-red-500" *ngIf="form.get('specialization')?.errors?.['required'] && form.get('specialization')?.touched">
                Specialization is required
              </small>
            </div>

            <div class="flex justify-content-end gap-2 mt-4">
              <p-button
                type="button"
                label="Clear"
                icon="pi pi-times"
                styleClass="p-button-text"
                (onClick)="form.reset()"
              ></p-button>
              <p-button
                type="submit"
                label="Submit"
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

      .p-dropdown {
        width: 100%;
      }

      .p-inputtext {
        padding-left: 2.5rem;
      }

      .p-input-icon-left {
        i {
          left: 0.75rem;
          color: var(--text-color-secondary);
        }
      }
    }
  `]
})
export class InvestigatorFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private investigatorService = inject(InvestigatorService);
  private portfolioService = inject(PortfolioService);
  private messageService = inject(MessageService);

  form: FormGroup;
  portfolios: Portfolio[] = [];
  submitting = false;

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      portfolioId: [null, Validators.required],
      specialization: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadPortfolios();
  }

  private loadPortfolios() {
    this.portfolioService.getPortfolios().subscribe(
      (data) => {
        this.portfolios = data;
      },
      (error) => {
        console.error('Error loading portfolios:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load portfolios. Please try again later.'
        });
      }
    );
  }

  getSelectedPortfolioName(): string {
    const portfolioId = this.form.get('portfolioId')?.value;
    const portfolio = this.portfolios.find(p => p.id === portfolioId);
    return portfolio?.name || '';
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitting = true;
      this.investigatorService.createInvestigator(this.form.value).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Investigator created successfully'
          });
          this.form.reset();
          this.submitting = false;
        },
        (error) => {
          console.error('Error creating investigator:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create investigator. Please try again.'
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
} 