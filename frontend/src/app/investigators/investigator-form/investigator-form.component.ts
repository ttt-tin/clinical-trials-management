import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Investigator, InvestigatorRole, CreateInvestigatorDto } from '../../core/models/investigator.model';
import { InvestigatorService } from '../../core/services/investigator.service';
import { Portfolio } from '../../core/models/portfolio.model';
import { PortfolioService } from '../../core/services/portfolio.service';

interface InvestigatorForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  role: FormControl<InvestigatorRole>;
  specialization: FormControl<string>;
  isActive: FormControl<boolean>;
  portfolioId: FormControl<number>;
}

@Component({
  selector: 'app-investigator-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="investigator-form">
      <h1>{{ isEditMode() ? 'Edit' : 'Create' }} Clinical Trial Investigator</h1>

      <div *ngIf="loading()" class="loading">
        Loading investigator data...
      </div>

      <div *ngIf="error()" class="error-message">
        {{ error() }}
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" *ngIf="!loading()">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">First Name *</label>
            <input
              id="firstName"
              type="text"
              formControlName="firstName"
              [class.invalid]="isFieldInvalid('firstName')"
            >
            <div class="error-message" *ngIf="isFieldInvalid('firstName')">
              First name is required
            </div>
          </div>

          <div class="form-group">
            <label for="lastName">Last Name *</label>
            <input
              id="lastName"
              type="text"
              formControlName="lastName"
              [class.invalid]="isFieldInvalid('lastName')"
            >
            <div class="error-message" *ngIf="isFieldInvalid('lastName')">
              Last name is required
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email *</label>
          <input
            id="email"
            type="email"
            formControlName="email"
            [class.invalid]="isFieldInvalid('email')"
          >
          <div class="error-message" *ngIf="isFieldInvalid('email')">
            <span *ngIf="form.get('email')!.errors?.['required']">Email is required</span>
            <span *ngIf="form.get('email')!.errors?.['email']">Please enter a valid email address</span>
          </div>
        </div>

        <div class="form-group">
          <label for="phone">Phone Number *</label>
          <input
            id="phone"
            type="tel"
            formControlName="phone"
            [class.invalid]="isFieldInvalid('phone')"
          >
          <div class="error-message" *ngIf="isFieldInvalid('phone')">
            Phone number is required
          </div>
        </div>

        <div class="form-group">
          <label for="role">Role *</label>
          <select
            id="role"
            formControlName="role"
            [class.invalid]="isFieldInvalid('role')"
          >
            <option value="">Select a role</option>
            <option *ngFor="let role of roles" [value]="role">
              {{ role }}
            </option>
          </select>
          <div class="error-message" *ngIf="isFieldInvalid('role')">
            Role is required
          </div>
        </div>

        <div class="form-group">
          <label for="specialization">Specialization *</label>
          <input
            id="specialization"
            type="text"
            formControlName="specialization"
            [class.invalid]="isFieldInvalid('specialization')"
          >
          <div class="error-message" *ngIf="isFieldInvalid('specialization')">
            Specialization is required
          </div>
        </div>

        <div class="form-group">
          <label for="portfolioId">Portfolio *</label>
          <select
            id="portfolioId"
            formControlName="portfolioId"
            [class.invalid]="isFieldInvalid('portfolioId')"
          >
            <option value="">Select a portfolio</option>
            <option *ngFor="let portfolio of portfolios()" [value]="portfolio.id">
              {{ portfolio.title }} ({{ portfolio.category }})
            </option>
          </select>
          <div class="error-message" *ngIf="isFieldInvalid('portfolioId')">
            Portfolio is required
          </div>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" formControlName="isActive">
            Active Status
          </label>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" (click)="goBack()">Cancel</button>
          <button type="submit" class="btn-primary" [disabled]="form.invalid || submitting()">
            {{ submitting() ? 'Saving...' : 'Save Investigator' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .investigator-form {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .form-row {
      display: flex;
      gap: 20px;
    }

    .form-group {
      margin-bottom: 20px;
      flex: 1;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }

    input, select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    input.invalid, select.invalid {
      border-color: #dc3545;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 5px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .checkbox-label input {
      width: auto;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 20px;
    }

    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .loading {
      text-align: center;
      padding: 20px;
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
export class InvestigatorFormComponent implements OnInit {
  form: FormGroup<InvestigatorForm>;
  isEditMode = signal<boolean>(false);
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);
  error = signal<string | null>(null);
  roles = Object.values(InvestigatorRole);
  portfolios = signal<Portfolio[]>([]);

  constructor(
    private investigatorService: InvestigatorService,
    private portfolioService: PortfolioService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = new FormGroup<InvestigatorForm>({
      firstName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      lastName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email]
      }),
      phone: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      role: new FormControl(InvestigatorRole.SUB, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      specialization: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      isActive: new FormControl(true, { nonNullable: true }),
      portfolioId: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1)]
      })
    });
  }

  ngOnInit(): void {
    this.loadPortfolios();
    
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode.set(true);
      this.loadInvestigator(id);
    }
  }

  isFieldInvalid(fieldName: keyof InvestigatorForm): boolean {
    const control = this.form.get(fieldName);
    return control ? control.invalid && control.touched : false;
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.submitting.set(true);
    this.error.set(null);

    const investigatorData = this.form.getRawValue();

    const request = this.isEditMode()
      ? this.investigatorService.updateInvestigator(this.route.snapshot.params['id'], investigatorData)
      : this.investigatorService.createInvestigator(investigatorData);

    request.subscribe({
      next: () => {
        this.router.navigate(['/investigators']);
      },
      error: (error) => {
        console.error('Error saving investigator:', error);
        this.error.set('Failed to save investigator. Please try again later.');
        this.submitting.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/investigators']);
  }

  private loadPortfolios(): void {
    this.loading.set(true);
    this.error.set(null);

    this.portfolioService.getPortfolios().subscribe({
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

  private loadInvestigator(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.investigatorService.getInvestigator(id).subscribe({
      next: (investigator) => {
        this.form.patchValue(investigator);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading investigator:', error);
        this.error.set('Failed to load investigator. Please try again later.');
        this.loading.set(false);
      }
    });
  }
} 