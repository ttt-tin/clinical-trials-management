import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Investigator } from '../shared/investigator.model';
import { Portfolio } from '../shared/portfolio.model';
import { InvestigatorService } from '../shared/investigator.service';
import { PortfolioService } from '../shared/portfolio.service';

@Component({
  selector: 'app-investigator-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './investigator-list.component.html',
  styleUrls: ['./investigator-list.component.scss']
})
export class InvestigatorListComponent implements OnInit {
  investigators = signal<Investigator[]>([]);
  portfolio = signal<Portfolio | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Computed signal for sorting investigators by name
  sortedInvestigators = computed(() => {
    return [...this.investigators()].sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  });

  constructor(
    private route: ActivatedRoute,
    private investigatorService: InvestigatorService,
    private portfolioService: PortfolioService
  ) {}

  ngOnInit(): void {
    const portfolioId = this.route.snapshot.paramMap.get('id');
    if (portfolioId) {
      this.loadPortfolio(Number(portfolioId));
      this.loadInvestigators(Number(portfolioId));
    } else {
      this.error.set('Không tìm thấy ID dự án');
      this.loading.set(false);
    }
  }

  private loadPortfolio(portfolioId: number): void {
    this.portfolioService.getPortfolio(portfolioId).subscribe({
      next: (portfolio) => {
        this.portfolio.set(portfolio);
      },
      error: (error) => {
        this.error.set('Không thể tải thông tin dự án');
        this.loading.set(false);
        console.error('Error loading portfolio:', error);
      }
    });
  }

  private loadInvestigators(portfolioId: number): void {
    this.investigatorService.getInvestigatorsByPortfolio(portfolioId).subscribe({
      next: (investigators) => {
        this.investigators.set(investigators);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Không thể tải danh sách nhà nghiên cứu');
        this.loading.set(false);
        console.error('Error loading investigators:', error);
      }
    });
  }

  deleteInvestigator(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa nhà nghiên cứu này không?')) {
      this.loading.set(true);
      this.investigatorService.deleteInvestigator(id).subscribe({
        next: () => {
          this.investigators.update(current => 
            current.filter(investigator => investigator.id !== id)
          );
          this.loading.set(false);
        },
        error: (error) => {
          this.error.set('Không thể xóa nhà nghiên cứu');
          this.loading.set(false);
          console.error('Error deleting investigator:', error);
        }
      });
    }
  }
} 