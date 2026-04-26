import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { CurrencyCopPipe } from '../../../../shared/pipes/currency-cop.pipe';
import { ordersActions } from '../../store/orders.actions';
import { selectSelectedOrder } from '../../store/orders.selectors';

@Component({
  selector: 'ct-order-detail',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgFor, NgIf, RouterLink, MatButtonModule, MatCardModule, MatFormFieldModule, MatSelectModule, CurrencyCopPipe],
  template: `
    <div class="page-shell" *ngIf="order$ | async as order">
      <mat-card class="page-card detail-card">
        <h1>Pedido {{ order.id }}</h1>
        <p>Cliente: {{ order.customer_name ?? order.customer_id }}</p>
        <p>Subtotal: {{ order.subtotal | currencyCop }}</p>
        <p>Descuento: {{ order.discount | currencyCop }}</p>
        <p>Total: {{ order.total | currencyCop }}</p>

        <mat-form-field appearance="outline">
          <mat-label>Estado</mat-label>
          <mat-select [value]="order.status" (valueChange)="changeStatus(order.id, $event)">
            <mat-option *ngFor="let status of statuses" [value]="status">{{ status }}</mat-option>
          </mat-select>
        </mat-form-field>

        <a mat-stroked-button [routerLink]="['/payments']" [queryParams]="{ orderId: order.id }">Ver pagos</a>
      </mat-card>

      <mat-card class="page-card detail-card">
        <h2>Ítems</h2>
        <div class="row" *ngFor="let item of order.items">
          <span>{{ item.product_name ?? item.product_id }}</span>
          <span>{{ item.quantity }}</span>
          <span>{{ item.total ?? 0 | currencyCop }}</span>
        </div>
      </mat-card>

      <mat-card class="page-card detail-card">
        <h2>Historial de estado</h2>
        <div class="row" *ngFor="let status of order.status_history ?? []">
          <span>{{ status.status }}</span>
          <span>{{ status.changed_at | date: 'short' }}</span>
        </div>
      </mat-card>
    </div>
  `,
  styles: ['.detail-card{padding:1.5rem}.row{display:flex;justify-content:space-between;gap:1rem;padding:.7rem 0;border-bottom:1px solid var(--ct-border)}'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  protected readonly order$ = this.store.select(selectSelectedOrder);
  protected readonly statuses = ['PENDING', 'CONFIRMED', 'IN_PREPARATION', 'READY', 'DELIVERED', 'CANCELLED'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(ordersActions.loadOrderDetail({ id }));
    }
  }

  protected changeStatus(id: string, status: 'PENDING' | 'CONFIRMED' | 'IN_PREPARATION' | 'READY' | 'DELIVERED' | 'CANCELLED'): void {
    this.store.dispatch(ordersActions.updateOrderStatus({ id, status }));
    this.store.dispatch(ordersActions.loadOrderDetail({ id }));
  }
}

