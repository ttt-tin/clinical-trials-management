import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PortfolioListComponent } from './portfolios/portfolio-list/portfolio-list.component';
import { PortfolioFormComponent } from './portfolios/portfolio-form/portfolio-form.component';
import { InvestigatorListComponent } from './investigators/investigator-list/investigator-list.component';
import { InvestigatorFormComponent } from './investigators/investigator-form/investigator-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'portfolios', component: PortfolioListComponent },
  { path: 'portfolios/new', component: PortfolioFormComponent },
  { path: 'portfolios/:id/edit', component: PortfolioFormComponent },
  { path: 'portfolios/:id/investigators', component: InvestigatorListComponent },
  { path: 'investigators', component: InvestigatorListComponent },
  { path: 'investigators/new', component: InvestigatorFormComponent },
  { path: 'investigators/:id/edit', component: InvestigatorFormComponent }
];
