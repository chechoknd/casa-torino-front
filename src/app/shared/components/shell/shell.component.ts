import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { NavItem } from '../../../core/models/navigation.model';

@Component({
  selector: 'ct-shell',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, RouterLink, RouterLinkActive, RouterOutlet, MatButtonModule, MatIconModule],
  template: `
    <div class="shell" [ngClass]="{ collapsed: sidebarCollapsed, 'mobile-menu-open': mobileMenuOpen }">
      <div class="mobile-backdrop" *ngIf="mobileMenuOpen" (click)="closeMobileMenu()" aria-hidden="true"></div>

      <aside class="sidebar page-card" aria-label="Navegación principal">
        <div class="sidebar-inner">
          <div class="brand">
            <div class="brand-copy" *ngIf="!sidebarCollapsed || mobileMenuOpen">
              <span>Casa Torino</span>
              <small>Panel operativo</small>
            </div>
            <button
              mat-icon-button
              type="button"
              class="sidebar-toggle"
              [attr.aria-label]="sidebarCollapsed ? 'Expandir navegación' : 'Contraer navegación'"
              (click)="toggleSidebar()"
            >
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
              (click)="closeMobileMenu()"
            >
              <mat-icon>{{ item.icon }}</mat-icon>
              <span *ngIf="!sidebarCollapsed || mobileMenuOpen">{{ item.label }}</span>
            </a>
          </nav>

          <div class="sidebar-footer" *ngIf="!sidebarCollapsed || mobileMenuOpen">
            <strong>{{ auth.user()?.full_name || auth.user()?.username }}</strong>
            <small>{{ auth.user()?.email }}</small>
            <button mat-button type="button" class="logout-button" aria-label="Cerrar sesión" (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Salir</span>
            </button>
          </div>
        </div>
      </aside>

      <main class="content">
        <header class="topbar page-card">
          <div class="topbar-leading">
            <button
              mat-icon-button
              type="button"
              class="mobile-menu-button"
              aria-label="Abrir navegación"
              (click)="openMobileMenu()"
            >
              <mat-icon>menu</mat-icon>
            </button>
            <div class="topbar-copy">
              <div class="topbar-brand-row">
                <strong>Casa Torino</strong>
                <img src="/assets/images/casa_torino_logo.ico" alt="" class="topbar-brand-icon" />
              </div>
              <p>Administración de clientes, cocina, pedidos y pagos</p>
            </div>
          </div>
        </header>

        <section class="workspace">
          <router-outlet />
        </section>
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
        background-color: #EDE8DA;
        color: #3B4A2F;
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
        z-index: 20;
        background-color: #EDE8DA;
      }

      .sidebar-inner {
        display: flex;
        flex-direction: column;
        min-height: 100%;
        padding: 1.25rem;
      }

      .sidebar-toggle,
      .mobile-menu-button {
        flex: 0 0 auto;
        color: #2D5016;
      }

      .mobile-menu-button {
        display: none;
      }

      .mobile-backdrop {
        display: none;
      }

      .sidebar-footer {
        display: grid;
        gap: 0.35rem;
        margin-top: auto;
        padding-top: 1rem;
      }

      .sidebar-footer strong {
        font-size: 0.95rem;
        color: #1E3A0F;
      }

      .sidebar-footer small {
        line-height: 1.45;
        color: #7A8C6E;
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
        color: #1E3A0F;
      }

      .brand small,
      .topbar p {
        color: #7A8C6E;
      }

      nav {
        display: grid;
        gap: 0.45rem;
      }

      .nav-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: #3B4A2F;
        text-decoration: none;
        padding: 0.85rem 1rem;
        border-radius: 14px;
        transition: all 0.2s;
      }

      .nav-link mat-icon {
        color: #2D5016;
      }

      .nav-link.active,
      .nav-link:hover {
        background: #D4E6C3;
        color: #1E3A0F;
      }

      .nav-link.active mat-icon,
      .nav-link:hover mat-icon {
        color: #1E3A0F;
      }

      .content {
        display: grid;
        grid-template-rows: auto 1fr auto;
        gap: 1rem;
        min-width: 0;
        min-height: calc(100dvh - 2rem);
      }

      .topbar {
        padding: 1rem 1.25rem 0.95rem;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
        overflow: visible;
        position: relative;
        z-index: 10;
        background-color: #EDE8DA;
      }

      .topbar-leading {
        display: flex;
        align-items: flex-start;
        gap: 0.8rem;
        flex: 1 1 auto;
        min-width: 0;
        padding-top: 0.1rem;
      }

      .topbar-copy {
        display: grid;
        gap: 0.15rem;
        min-width: 0;
      }

      .topbar-brand-row {
        display: flex;
        align-items: center;
        gap: 0.45rem;
        min-width: 0;
      }

      .topbar-copy strong {
        line-height: 1.1;
      }

      .topbar-brand-icon {
        width: 24px;
        height: 24px;
        flex: 0 0 auto;
        object-fit: contain;
      }

      .topbar p {
        margin: 0;
        line-height: 1.35;
      }

      .logout-button {
        margin-top: 0.15rem;
        color: #2D5016;
        width: 100%;
        justify-content: flex-start;
      }
      .logout-button:hover {
        background-color: #EDE8DA;
      }

      .workspace {
        min-width: 0;
      }

      @media (max-width: 980px) {
        .shell {
          grid-template-columns: 1fr;
          padding: 0.75rem;
          gap: 0.75rem;
        }

        .shell.collapsed {
          grid-template-columns: 1fr;
        }

        .sidebar {
          position: fixed;
          inset: 0 auto 0 0;
          width: min(84vw, 320px);
          height: 100dvh;
          border-radius: 0 var(--radius-xl) var(--radius-xl) 0;
          transform: translateX(-105%);
          transition: transform var(--transition-base);
          box-shadow: var(--shadow-lg);
          overflow-y: auto;
        }

        .mobile-menu-open .sidebar {
          transform: translateX(0);
        }

        .mobile-backdrop {
          display: block;
          position: fixed;
          inset: 0;
          z-index: 15;
          background: rgba(30, 58, 15, 0.46);
          backdrop-filter: blur(2px);
        }

        .sidebar-toggle {
          display: none;
        }

        .mobile-menu-button {
          display: inline-flex;
        }

        nav {
          grid-template-columns: 1fr;
        }

        .brand {
          align-items: center;
        }

        .brand-copy {
          display: grid;
        }

        .topbar {
          flex-wrap: nowrap;
          padding: 0.85rem;
        }

        .topbar-leading {
          padding-top: 0;
        }

        .topbar-copy p {
          display: none;
        }

        .topbar-brand-icon {
          width: 20px;
          height: 20px;
        }

        .content {
          gap: 0.75rem;
          min-height: calc(100dvh - 1.5rem);
        }
      }

      @media (max-width: 560px) {
        .shell {
          padding: 0.5rem;
        }

        .topbar {
          gap: 0.75rem;
        }

        .topbar-leading {
          width: auto;
        }

        .topbar-copy {
          min-width: 0;
        }

        .topbar-copy strong {
          overflow-wrap: anywhere;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected sidebarCollapsed = false;
  protected mobileMenuOpen = false;
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

  protected openMobileMenu(): void {
    this.mobileMenuOpen = true;
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  protected logout(): void {
    this.closeMobileMenu();
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
