import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';
import { selectAllOrders } from '../../../orders/store/orders.selectors';
import { customersActions } from '../../store/customers.actions';
import { selectSelectedCustomer } from '../../store/customers.selectors';
import { ordersActions } from '../../../orders/store/orders.actions';

@Component({
  selector: 'ct-customer-detail',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgIf, NgFor, RouterLink, MatButtonModule, MatCardModule],
  template: `
    <div class="page-shell" *ngIf="vm$ | async as vm">
      <mat-card class="page-card detail-card" *ngIf="vm.customer">
        <h1>{{ vm.customer.full_name }}</h1>
        <p>{{ vm.customer.email }} · {{ vm.customer.phone }}</p>
        <p>Tipo: {{ vm.customer.customer_type }}</p>
        <p>Estado: {{ vm.customer.is_active ? 'Activo' : 'Inactivo' }}</p>
        <p>Creado: {{ vm.customer.created_at | date: 'medium' }}</p>
        <div class="actions">
          <a mat-stroked-button [routerLink]="['/customers/edit', vm.customer.id]">Editar</a>
        </div>
      </mat-card>

      <mat-card class="page-card detail-card">
        <h2>Historial de pedidos</h2>
        <div class="history" *ngFor="let order of vm.orders">
          <strong>{{ order.order_label ?? 'Sin consecutivo' }}</strong>
          <span>{{ order.status }}</span>
          <small>{{ order.created_at | date: 'short' }}</small>
        </div>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .detail-card {
        padding: 1.5rem;
      }

      .actions {
        margin-top: 1rem;
      }

      .history {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.9rem 0;
        border-bottom: 1px solid var(--ct-border);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  protected readonly vm$ = combineLatest([
    this.store.select(selectSelectedCustomer),
    this.store.select(selectAllOrders)
  ]).pipe(
    map(([customer, orders]) => ({
      customer,
      orders: customer ? orders.filter((order) => order.customer_id === customer.id) : []
    }))
  );

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(customersActions.loadCustomerDetail({ id }));
      this.store.dispatch(ordersActions.loadOrders());
    }
  }
}
