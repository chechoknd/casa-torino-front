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
            <strong>Soluciones Gastronómicas</strong>
            <small>Operación centralizada de clientes, cocina, pedidos y pagos.</small>
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
              <strong>Casa Torino</strong>
              <p>Administración de clientes, cocina, pedidos y pagos</p>
            </div>
          </div>
          <div class="topbar-meta">
            <span class="desktop-user-name">{{ auth.user()?.full_name || auth.user()?.username }}</span>
            <small class="desktop-user-email">{{ auth.user()?.email }}</small>
            <button mat-button type="button" class="logout-button" aria-label="Cerrar sesión" (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span class="logout-text">Salir</span>
            </button>
            <span class="mobile-user-initial" aria-label="Inicial del usuario">{{ userInitial }}</span>
          </div>
        </header>
        <section class="workspace">
          <router-outlet />
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
        z-index: 20;
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
        justify-items: end;
      }

      .topbar-meta span {
        font-weight: 600;
      }

      .logout-button {
        margin-top: 0.25rem;
      }

      .mobile-user-initial {
        display: none;
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
          background: rgba(16, 29, 9, 0.46);
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

        .topbar-meta,
        .footer {
          text-align: left;
        }

        .topbar {
          align-items: flex-start;
          flex-wrap: nowrap;
          padding: 0.85rem;
        }

        .topbar-leading {
          flex: 1 1 auto;
          min-width: 0;
        }

        .topbar-copy p {
          display: none;
        }

        .topbar-meta {
          align-self: flex-start;
          gap: 0.2rem;
          justify-items: center;
          min-width: 44px;
          text-align: center;
        }

        .desktop-user-name,
        .desktop-user-email,
        .logout-text {
          display: none;
        }

        .mobile-user-initial {
          display: inline-grid;
          place-items: center;
          width: 28px;
          height: 28px;
          color: var(--color-primary);
          background: var(--color-primary-muted);
          border: 1px solid rgba(45, 80, 22, 0.16);
          border-radius: 999px;
          font-size: 0.82rem;
          font-weight: 800;
          line-height: 1;
        }

        .logout-button {
          min-width: 44px;
          width: 44px;
          height: 44px;
          margin-top: 0;
          padding: 0;
        }

        .content {
          gap: 0.75rem;
          min-height: calc(100dvh - 1.5rem);
        }

        .footer {
          padding: 0.85rem;
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

        .topbar-copy strong,
        .desktop-user-name,
        .desktop-user-email {
          overflow-wrap: anywhere;
        }

        .footer {
          display: none;
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

  protected get userInitial(): string {
    const user = this.auth.user();
    const displayName = user?.full_name || user?.username || user?.email || 'U';
    return displayName.trim().charAt(0).toUpperCase();
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
