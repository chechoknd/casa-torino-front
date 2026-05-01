import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';
import { customersActions } from '../customers/store/customers.actions';
import { selectActiveCustomers } from '../customers/store/customers.selectors';
import { ingredientsActions } from '../ingredients/store/ingredients.actions';
import { ordersActions } from '../orders/store/orders.actions';
import { selectLatestOrders, selectPendingOrdersToday } from '../orders/store/orders.selectors';
import { productsActions } from '../products/store/products.actions';
import { selectActiveProducts } from '../products/store/products.selectors';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'ct-dashboard',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgFor, NgIf, MatCardModule, StatusBadgeComponent],
  template: `
    <div class="page-shell" *ngIf="vm$ | async as vm">
      <div class="stats-grid">
        <mat-card class="page-card stat-card"><strong>{{ vm.activeCustomers }}</strong><span>Clientes activos</span></mat-card>
        <mat-card class="page-card stat-card"><strong>{{ vm.activeProducts }}</strong><span>Productos activos</span></mat-card>
        <mat-card class="page-card stat-card"><strong>{{ vm.pendingToday }}</strong><span>Pedidos del día</span></mat-card>
      </div>

      <mat-card class="page-card latest-card">
        <h2>Últimos 5 pedidos</h2>
        <div class="latest-row" *ngFor="let order of vm.latestOrders">
          <div>
            <strong>{{ order.order_label ?? 'Sin consecutivo' }}</strong>
            <small>{{ order.created_at | date: 'short' }}</small>
          </div>
          <ct-status-badge [label]="order.status" [tone]="order.status === 'DELIVERED' ? 'success' : order.status === 'CANCELLED' ? 'danger' : 'info'" />
        </div>
      </mat-card>
    </div>
  `,
  styles: ['.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem}.stat-card,.latest-card{padding:1.5rem}.stat-card strong{font-size:2rem}.stat-card span{display:block;color:var(--ct-muted);margin-top:.4rem}.latest-row{display:flex;justify-content:space-between;gap:1rem;padding:.85rem 0;border-bottom:1px solid var(--ct-border)}small{display:block;color:var(--ct-muted);margin-top:.2rem}'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  private readonly store = inject(Store);
  protected readonly vm$ = combineLatest([
    this.store.select(selectActiveCustomers),
    this.store.select(selectActiveProducts),
    this.store.select(selectPendingOrdersToday),
    this.store.select(selectLatestOrders)
  ]).pipe(
    map(([customers, products, pendingOrders, latestOrders]) => ({
      activeCustomers: customers.length,
      activeProducts: products.length,
      pendingToday: pendingOrders.length,
      latestOrders
    }))
  );

  ngOnInit(): void {
    this.store.dispatch(customersActions.loadCustomers());
    this.store.dispatch(productsActions.loadProducts());
    this.store.dispatch(ingredientsActions.loadIngredients());
    this.store.dispatch(ordersActions.loadOrders());
  }
}
