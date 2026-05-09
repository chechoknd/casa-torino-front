import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { Order } from '../../../../core/models/order.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { CurrencyCopPipe } from '../../../../shared/pipes/currency-cop.pipe';
import { EntityToolbarComponent } from '../../../../shared/components/entity-toolbar/entity-toolbar.component';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { selectUiLoading } from '../../../../store/ui.selectors';
import { ordersActions } from '../../store/orders.actions';
import { selectAllOrders } from '../../store/orders.selectors';

@Component({
  selector: 'ct-order-list',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgIf, MatButtonModule, MatIconModule, MatPaginatorModule, MatTableModule, StatusBadgeComponent, CurrencyCopPipe, EntityToolbarComponent, SkeletonLoaderComponent],
  template: `
    <div class="page-shell">
      <ct-entity-toolbar title="Pedidos" subtitle="Seguimiento operativo y flujo de estados." actionLabel="Nuevo pedido" (create)="router.navigate(['/orders/new'])" />
      <section class="page-card table-card">
        <ct-skeleton-loader *ngIf="loading$ | async; else ordersTable" [rows]="6" variant="table" />
        <ng-template #ordersTable>
          <table mat-table [dataSource]="(pagedOrders$ | async) ?? []">
            <ng-container matColumnDef="order"><th mat-header-cell *matHeaderCellDef>Orden</th><td mat-cell *matCellDef="let order">{{ order.order_label ?? 'Sin consecutivo' }}</td></ng-container>
            <ng-container matColumnDef="customer"><th mat-header-cell *matHeaderCellDef>Cliente</th><td mat-cell *matCellDef="let order">{{ order.customer_name ?? 'Sin nombre' }}</td></ng-container>
            <ng-container matColumnDef="products"><th mat-header-cell *matHeaderCellDef>Productos</th><td mat-cell *matCellDef="let order">{{ productNames(order) }}</td></ng-container>
            <ng-container matColumnDef="total"><th mat-header-cell *matHeaderCellDef>Total</th><td mat-cell *matCellDef="let order">{{ order.total | currencyCop }}</td></ng-container>
            <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Estado</th><td mat-cell *matCellDef="let order"><ct-status-badge [label]="order.status" [tone]="statusTone(order.status)" /></td></ng-container>
            <ng-container matColumnDef="created_at"><th mat-header-cell *matHeaderCellDef>Fecha</th><td mat-cell *matCellDef="let order">{{ order.created_at | date: 'short' }}</td></ng-container>
            <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let order"><button mat-icon-button aria-label="Ver pedido" (click)="router.navigate(['/orders', order.id])"><mat-icon>visibility</mat-icon></button></td></ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
          <mat-paginator [length]="total$ | async" [pageSize]="pageSize" [pageSizeOptions]="[5,10,20]" (page)="onPageChange($event)" />
        </ng-template>
      </section>
    </div>
  `,
  styles: ['.table-card{padding:.75rem;overflow-x:auto;overflow-y:visible}table{width:100%}'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderListComponent implements OnInit {
  protected readonly router = inject(Router);
  private readonly store = inject(Store);
  protected readonly displayedColumns = ['order', 'customer', 'products', 'total', 'status', 'created_at', 'actions'];
  protected pageIndex = 0;
  protected pageSize = 10;
  protected readonly ordersVm$ = this.store.select(selectAllOrders);
  protected readonly loading$ = this.store.select(selectUiLoading);
  protected readonly total$ = this.ordersVm$.pipe(map((orders) => orders.length));
  protected readonly pagedOrders$ = this.ordersVm$.pipe(
    map((orders) => orders.slice(this.pageIndex * this.pageSize, this.pageIndex * this.pageSize + this.pageSize))
  );

  ngOnInit(): void {
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

  protected productNames(order: Order): string {
    if (!order.items?.length) {
      return 'Sin productos';
    }

    return order.items
      .map((item) => item.product_name?.trim() || 'Sin nombre')
      .join(', ');
  }
}
