import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavItem } from '../../../core/models/navigation.model';

@Component({
  selector: 'ct-shell',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, RouterLink, RouterLinkActive, MatButtonModule, MatIconModule],
  template: `
    <div class="shell" [ngClass]="{ collapsed: sidebarCollapsed }">
      <aside class="sidebar page-card">
        <div class="sidebar-inner">
          <div class="brand">
            <div class="brand-copy" *ngIf="!sidebarCollapsed">
              <span>Casa Torino</span>
              <small>Panel operativo</small>
            </div>
            <button mat-icon-button type="button" class="sidebar-toggle" (click)="toggleSidebar()">
              <mat-icon>{{ sidebarCollapsed ? 'chevron_right' : 'chevron_left' }}</mat-icon>
            </button>
          </div>

          <nav>
            <a
              *ngFor="let item of navItems"
              [routerLink]="item.route"
              routerLinkActive="active"
              class="nav-link"
              [attr.aria-label]="item.label"
            >
              <mat-icon>{{ item.icon }}</mat-icon>
              <span *ngIf="!sidebarCollapsed">{{ item.label }}</span>
            </a>
          </nav>

          <div class="sidebar-footer" *ngIf="!sidebarCollapsed">
            <strong>Soluciones Gastronómicas</strong>
            <small>Operación centralizada de clientes, cocina, pedidos y pagos.</small>
          </div>
        </div>
      </aside>

      <main class="content">
        <header class="topbar page-card">
          <div class="topbar-leading">
            <div class="topbar-copy">
              <strong>Casa Torino</strong>
              <p>Administración de clientes, cocina, pedidos y pagos</p>
            </div>
          </div>
          <div class="topbar-meta">
            <span>Panel administrativo</span>
            <small>Diseñado para una operación clara y simétrica</small>
          </div>
        </header>
        <section class="workspace">
          <ng-content></ng-content>
        </section>
        <footer class="footer page-card">
          <div>
            <strong>Casa Torino</strong>
            <p>Soluciones gastronómicas para almuerzos, eventos, planes y catering.</p>
          </div>
          <small>Frontend operativo conectado con la API FastAPI.</small>
        </footer>
      </main>
    </div>
  `,
  styles: [
    `
      .shell {
        display: grid;
        grid-template-columns: 280px minmax(0, 1fr);
        min-height: 100dvh;
        gap: 1rem;
        padding: 1rem;
        align-items: stretch;
      }

      .shell.collapsed {
        grid-template-columns: 88px minmax(0, 1fr);
      }

      .sidebar {
        padding: 0;
        position: sticky;
        top: 1rem;
        align-self: stretch;
        height: calc(100dvh - 2rem);
      }

      .sidebar-inner {
        display: flex;
        flex-direction: column;
        min-height: 100%;
        padding: 1.25rem;
      }

      .sidebar-toggle,
      .topbar-toggle {
        flex: 0 0 auto;
      }

      .sidebar-footer {
        display: grid;
        gap: 0.35rem;
        margin-top: auto;
        padding-top: 1rem;
      }

      .sidebar-footer strong {
        font-size: 0.95rem;
      }

      .sidebar-footer small {
        line-height: 1.45;
      }

      .brand {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 0.75rem;
        margin-bottom: 1.25rem;
      }

      .brand-copy {
        display: grid;
        gap: 0.2rem;
      }

      .brand span {
        font-size: 1.4rem;
        font-weight: 700;
      }

      .brand small,
      .topbar p {
        color: var(--ct-muted);
      }

      nav {
        display: grid;
        gap: 0.45rem;
      }

      .nav-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: inherit;
        text-decoration: none;
        padding: 0.85rem 1rem;
        border-radius: 14px;
      }

      .nav-link.active,
      .nav-link:hover {
        background: rgba(214, 145, 57, 0.16);
      }

      .content {
        display: grid;
        grid-template-rows: auto 1fr auto;
        gap: 1rem;
        min-width: 0;
        min-height: calc(100dvh - 2rem);
      }

      .topbar {
        padding: 1rem 1.25rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .topbar-leading {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .topbar p {
        margin: 0.35rem 0 0;
      }

      .topbar-meta {
        display: grid;
        gap: 0.2rem;
        text-align: right;
      }

      .topbar-meta span {
        font-weight: 600;
      }

      .footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
        padding: 1rem 1.25rem;
      }

      .footer p {
        margin: 0.3rem 0 0;
      }

      .workspace {
        min-width: 0;
      }

      @media (max-width: 980px) {
        .shell {
          grid-template-columns: 1fr;
        }

        .shell.collapsed {
          grid-template-columns: 1fr;
        }

        .sidebar {
          position: static;
          height: auto;
        }

        nav {
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        }

        .topbar-meta,
        .footer {
          text-align: left;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent {
  protected sidebarCollapsed = false;
  protected readonly navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Clientes', route: '/customers', icon: 'groups' },
    { label: 'Productos', route: '/products', icon: 'lunch_dining' },
    { label: 'Ingredientes', route: '/ingredients', icon: 'inventory_2' },
    { label: 'Recetas', route: '/recipes', icon: 'menu_book' },
    { label: 'Pedidos', route: '/orders', icon: 'receipt_long' },
    { label: 'Pagos', route: '/payments', icon: 'payments' }
  ];

  protected toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
