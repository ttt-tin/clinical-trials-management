import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Portfolio, PortfolioCategory } from '../../core/models/portfolio.model';
import { PortfolioService } from '../../core/services/portfolio.service';

interface PortfolioForm {
  title: FormControl<string>;
  description: FormControl<string>;
  category: FormControl<PortfolioCategory>;
  isActive: FormControl<boolean>;
  progress: FormControl<number>;
  tags: FormControl<string[]>;
}

@Component({
  selector: 'app-portfolio-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="portfolio-form">
      <h1>{{ isEditMode() ? 'Edit' : 'Create' }} Portfolio</h1>

      <div *ngIf="loading()" class="loading">
        Loading portfolio data...
      </div>

      <div *ngIf="error()" class="error-message">
        {{ error() }}
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" *ngIf="!loading()">
        <div class="form-group">
          <label for="title">Title *</label>
          <input
            id="title"
            type="text"
            formControlName="title"
            [class.invalid]="isFieldInvalid('title')"
          >
          <div class="error-message" *ngIf="isFieldInvalid('title')">
            Title is required
          </div>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            formControlName="description"
            rows="4"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="category">Category *</label>
          <select
            id="category"
            formControlName="category"
            [class.invalid]="isFieldInvalid('category')"
          >
            <option value="">Select a category</option>
            <option *ngFor="let category of categories" [value]="category">
              {{ category }}
            </option>
          </select>
          <div class="error-message" *ngIf="isFieldInvalid('category')">
            Category is required
          </div>
        </div>

        <div class="form-group">
          <label for="progress">Progress *</label>
          <input
            id="progress"
            type="number"
            formControlName="progress"
            min="0"
            max="100"
            [class.invalid]="isFieldInvalid('progress')"
          >
          <div class="error-message" *ngIf="isFieldInvalid('progress')">
            <span *ngIf="form.get('progress')!.errors?.['required']">Progress is required</span>
            <span *ngIf="form.get('progress')!.errors?.['min']">Progress must be at least 0</span>
            <span *ngIf="form.get('progress')!.errors?.['max']">Progress cannot exceed 100</span>
          </div>
        </div>

        <div class="form-group">
          <label for="tags">Tags (comma-separated)</label>
          <input
            id="tags"
            type="text"
            [value]="tagsInput()"
            (input)="updateTags($event)"
          >
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
            {{ submitting() ? 'Saving...' : 'Save Portfolio' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .portfolio-form {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }

    input, select, textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    textarea {
      resize: vertical;
      min-height: 100px;
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
  `]
})
export class PortfolioFormComponent implements OnInit {
  form: FormGroup<PortfolioForm>;
  isEditMode = signal<boolean>(false);
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);
  error = signal<string | null>(null);
  tagsInput = signal<string>('');
  categories = Object.values(PortfolioCategory);

  constructor(
    private portfolioService: PortfolioService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = new FormGroup<PortfolioForm>({
      title: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      description: new FormControl('', {
        nonNullable: true
      }),
      category: new FormControl<PortfolioCategory>(PortfolioCategory.OTHER, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      isActive: new FormControl(true, { nonNullable: true }),
      progress: new FormControl(0, {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.min(0),
          Validators.max(100)
        ]
      }),
      tags: new FormControl<string[]>([], { nonNullable: true })
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode.set(true);
      this.loadPortfolio(id);
    }
  }

  isFieldInvalid(fieldName: keyof PortfolioForm): boolean {
    const control = this.form.get(fieldName);
    return control ? control.invalid && control.touched : false;
  }

  updateTags(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.tagsInput.set(input.value);
    const tags = input.value.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    this.form.get('tags')?.setValue(tags);
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.submitting.set(true);
    this.error.set(null);

    const portfolioData = this.form.getRawValue();

    const request = this.isEditMode()
      ? this.portfolioService.updatePortfolio(this.route.snapshot.params['id'], portfolioData)
      : this.portfolioService.createPortfolio(portfolioData);

    request.subscribe({
      next: () => {
        this.router.navigate(['/portfolios']);
      },
      error: (error) => {
        console.error('Error saving portfolio:', error);
        this.error.set('Failed to save portfolio. Please try again later.');
        this.submitting.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/portfolios']);
  }

  private loadPortfolio(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.portfolioService.getPortfolio(id).subscribe({
      next: (portfolio) => {
        this.form.patchValue(portfolio);
        this.tagsInput.set(portfolio.tags?.join(', ') || '');
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading portfolio:', error);
        this.error.set('Failed to load portfolio. Please try again later.');
        this.loading.set(false);
      }
    });
  }
} 