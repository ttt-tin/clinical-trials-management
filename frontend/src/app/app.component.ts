import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MenubarModule,
    ButtonModule
  ],
  template: `
    <div class="layout-wrapper">
      <p-menubar [model]="menuItems" styleClass="surface-card shadow-sm border-none px-4">
        <ng-template pTemplate="start">
          <div class="flex items-center gap-2">
            <img src="assets/logo.svg" height="40" alt="Logo">
            <span class="text-lg font-semibold text-primary">Clinical Trials</span>
          </div>
        </ng-template>
      </p-menubar>

      <div class="layout-main">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }

    .layout-wrapper {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .layout-main {
      flex: 1;
      background-color: var(--surface-ground);
      padding: 2rem;
    }

    ::ng-deep {
      .p-menubar {
        padding: 1rem;
        background: var(--surface-card);
        border: none;
        border-radius: 0;
        display: flex;
        justify-content: space-between;

        .p-menubar-root-list {
          margin-left: auto;
          padding-left: 2rem;
          gap: 0.5rem;
        }

        .p-menuitem {
          margin-right: 0.5rem;
        }

        .p-menuitem-link {
          padding: 0.75rem 1.25rem;
          border-radius: 6px;
          transition: all 0.2s ease;

          &:hover {
            background-color: var(--primary-color);
            color: white;

            .p-menuitem-icon,
            .p-menuitem-text {
              color: white;
            }
          }

          &.router-link-active {
            background-color: var(--primary-color);
            color: white;

            .p-menuitem-icon,
            .p-menuitem-text {
              color: white;
            }
          }

          .p-menuitem-icon {
            color: var(--primary-color);
            margin-right: 0.5rem;
          }

          .p-menuitem-text {
            color: var(--text-color);
            font-weight: 500;
          }
        }
      }
    }
  `]
})
export class AppComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-chart-bar',
      routerLink: '/dashboard'
    },
    {
      label: 'Portfolios',
      icon: 'pi pi-folder',
      routerLink: '/portfolios'
    },
    {
      label: 'Investigators',
      icon: 'pi pi-users',
      routerLink: '/investigators'
    }
  ];
}
