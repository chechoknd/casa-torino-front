import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';
import { customersActions } from '../../../customers/store/customers.actions';
import { selectAllCustomers } from '../../../customers/store/customers.selectors';
import { productsActions } from '../../../products/store/products.actions';
import { selectAllProducts } from '../../../products/store/products.selectors';
import { CurrencyCopPipe } from '../../../../shared/pipes/currency-cop.pipe';
import { ordersActions } from '../../store/orders.actions';
import { selectAllOrders, selectSelectedOrder } from '../../store/orders.selectors';
import { orderDisplayNumber } from '../../../../shared/utils/order-display';

@Component({
  selector: 'ct-order-detail',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgFor, NgIf, RouterLink, MatButtonModule, MatCardModule, MatFormFieldModule, MatSelectModule, CurrencyCopPipe],
  template: `
    <div class="page-shell" *ngIf="vm$ | async as vm">
      <mat-card class="page-card detail-card">
        <h1>Orden {{ vm.display_number }}</h1>
        <p>Cliente: {{ vm.customer_name }}</p>
        <p>Subtotal: {{ vm.order.subtotal | currencyCop }}</p>
        <p>Descuento: {{ vm.order.discount | currencyCop }}</p>
        <p>Total: {{ vm.order.total | currencyCop }}</p>

        <mat-form-field appearance="outline">
          <mat-label>Estado</mat-label>
          <mat-select [value]="vm.order.status" (valueChange)="changeStatus(vm.order.id, $event)">
            <mat-option *ngFor="let status of statuses" [value]="status">{{ status }}</mat-option>
          </mat-select>
        </mat-form-field>

        <a mat-stroked-button [routerLink]="['/payments']" [queryParams]="{ orderId: vm.order.id }">Ver pagos</a>
      </mat-card>

      <mat-card class="page-card detail-card">
        <h2>Ítems</h2>
        <div class="row" *ngFor="let item of vm.items">
          <span>{{ item.product_name }}</span>
          <span>{{ item.quantity }}</span>
          <span>{{ item.total ?? 0 | currencyCop }}</span>
        </div>
      </mat-card>

      <mat-card class="page-card detail-card">
        <h2>Historial de estado</h2>
        <div class="row" *ngFor="let status of vm.order.status_history ?? []">
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
  protected readonly vm$ = combineLatest([
    this.store.select(selectSelectedOrder),
    this.store.select(selectAllOrders),
    this.store.select(selectAllCustomers),
    this.store.select(selectAllProducts)
  ]).pipe(
    map(([order, orders, customers, products]) => {
      if (!order) {
        return null;
      }

      return {
        order,
        display_number: orderDisplayNumber(order, orders),
        customer_name: order.customer_name ?? customers.find((customer) => customer.id === order.customer_id)?.full_name ?? 'Cliente sin nombre',
        items: order.items.map((item) => ({
          ...item,
          product_name: item.product_name ?? products.find((product) => product.id === item.product_id)?.name ?? 'Producto sin nombre'
        }))
      };
    })
  );
  protected readonly statuses = ['PENDING', 'CONFIRMED', 'IN_PREPARATION', 'READY', 'DELIVERED', 'CANCELLED'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(customersActions.loadCustomers());
      this.store.dispatch(productsActions.loadProducts());
      this.store.dispatch(ordersActions.loadOrders());
      this.store.dispatch(ordersActions.loadOrderDetail({ id }));
    }
  }

  protected changeStatus(id: string, status: 'PENDING' | 'CONFIRMED' | 'IN_PREPARATION' | 'READY' | 'DELIVERED' | 'CANCELLED'): void {
    this.store.dispatch(ordersActions.updateOrderStatus({ id, status }));
    this.store.dispatch(ordersActions.loadOrderDetail({ id }));
  }
}
