import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';
import { selectAllCustomers } from '../../../customers/store/customers.selectors';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { CurrencyCopPipe } from '../../../../shared/pipes/currency-cop.pipe';
import { EntityToolbarComponent } from '../../../../shared/components/entity-toolbar/entity-toolbar.component';
import { customersActions } from '../../../customers/store/customers.actions';
import { ordersActions } from '../../store/orders.actions';
import { selectAllOrders } from '../../store/orders.selectors';

@Component({
  selector: 'ct-order-list',
  standalone: true,
  imports: [AsyncPipe, DatePipe, MatButtonModule, MatIconModule, MatPaginatorModule, MatTableModule, StatusBadgeComponent, CurrencyCopPipe, EntityToolbarComponent],
  template: `
    <div class="page-shell">
      <ct-entity-toolbar title="Pedidos" subtitle="Seguimiento operativo y flujo de estados." actionLabel="Nuevo pedido" (create)="router.navigate(['/orders/new'])" />
      <section class="page-card table-card">
        <table mat-table [dataSource]="(pagedOrders$ | async) ?? []">
          <ng-container matColumnDef="customer"><th mat-header-cell *matHeaderCellDef>Cliente</th><td mat-cell *matCellDef="let order">{{ order.customer_name }}</td></ng-container>
          <ng-container matColumnDef="total"><th mat-header-cell *matHeaderCellDef>Total</th><td mat-cell *matCellDef="let order">{{ order.total | currencyCop }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Estado</th><td mat-cell *matCellDef="let order"><ct-status-badge [label]="order.status" [tone]="statusTone(order.status)" /></td></ng-container>
          <ng-container matColumnDef="created_at"><th mat-header-cell *matHeaderCellDef>Fecha</th><td mat-cell *matCellDef="let order">{{ order.created_at | date: 'short' }}</td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let order"><button mat-icon-button (click)="router.navigate(['/orders', order.id])"><mat-icon>visibility</mat-icon></button></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
        <mat-paginator [length]="total$ | async" [pageSize]="pageSize" [pageSizeOptions]="[5,10,20]" (page)="onPageChange($event)" />
      </section>
    </div>
  `,
  styles: ['.table-card{padding:.75rem;overflow:hidden}table{width:100%}'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderListComponent implements OnInit {
  protected readonly router = inject(Router);
  private readonly store = inject(Store);
  protected readonly displayedColumns = ['customer', 'total', 'status', 'created_at', 'actions'];
  protected pageIndex = 0;
  protected pageSize = 10;
  protected readonly ordersVm$ = combineLatest([
    this.store.select(selectAllOrders),
    this.store.select(selectAllCustomers)
  ]).pipe(
    map(([orders, customers]) =>
      orders.map((order) => ({
        ...order,
        customer_name: customers.find((customer) => customer.id === order.customer_id)?.full_name ?? order.customer_id
      }))
    )
  );
  protected readonly total$ = this.ordersVm$.pipe(map((orders) => orders.length));
  protected readonly pagedOrders$ = this.ordersVm$.pipe(
    map((orders) => orders.slice(this.pageIndex * this.pageSize, this.pageIndex * this.pageSize + this.pageSize))
  );

  ngOnInit(): void {
    this.store.dispatch(customersActions.loadCustomers());
    this.store.dispatch(ordersActions.loadOrders());
  }

  protected onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.store.dispatch(ordersActions.loadOrders());
  }

  protected statusTone(status: string): 'success' | 'warning' | 'danger' | 'info' | 'muted' {
    if (status === 'DELIVERED' || status === 'READY') return 'success';
    if (status === 'CANCELLED') return 'danger';
    if (status === 'PENDING') return 'warning';
    return 'info';
  }
}
