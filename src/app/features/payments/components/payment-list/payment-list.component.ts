import { AsyncPipe, DatePipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { combineLatest, map, startWith } from 'rxjs';
import { ordersActions } from '../../../orders/store/orders.actions';
import { selectAllOrders } from '../../../orders/store/orders.selectors';
import { Payment } from '../../../../core/models/payment.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { CurrencyCopPipe } from '../../../../shared/pipes/currency-cop.pipe';
import { paymentsActions } from '../../store/payments.actions';
import { selectAllPayments } from '../../store/payments.selectors';

@Component({
  selector: 'ct-payment-list',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgFor, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatSelectModule, MatTableModule, StatusBadgeComponent, CurrencyCopPipe],
  template: `
    <div class="page-shell">
      <mat-card class="page-card form-card">
        <h1>Pagos</h1>
        <form [formGroup]="selectorForm" class="selector">
          <mat-form-field appearance="outline">
            <mat-label>Pedido</mat-label>
            <mat-select formControlName="orderId" (valueChange)="loadPayments($event)">
              <mat-option value="">Todos los pagos</mat-option>
              <mat-option *ngFor="let order of orders$ | async" [value]="order.id">{{ order.order_label ?? 'Sin consecutivo' }} · {{ order.customer_name ?? 'Sin nombre' }} · {{ order.total | currencyCop }}</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-flat-button color="primary" type="button" (click)="router.navigate(['/payments/new'], { queryParams: { orderId: selectorForm.value.orderId } })" [disabled]="!selectorForm.value.orderId">
            Registrar pago
          </button>
        </form>
      </mat-card>

      <mat-card class="page-card table-card">
        <table mat-table [dataSource]="(filteredPayments$ | async) ?? []">
          <ng-container matColumnDef="order"><th mat-header-cell *matHeaderCellDef>Orden</th><td mat-cell *matCellDef="let payment">{{ payment.order_label ?? 'Sin consecutivo' }}</td></ng-container>
          <ng-container matColumnDef="products"><th mat-header-cell *matHeaderCellDef>Productos</th><td mat-cell *matCellDef="let payment">{{ productNames(payment) }}</td></ng-container>
          <ng-container matColumnDef="amount"><th mat-header-cell *matHeaderCellDef>Monto</th><td mat-cell *matCellDef="let payment">{{ payment.amount | currencyCop }}</td></ng-container>
          <ng-container matColumnDef="method"><th mat-header-cell *matHeaderCellDef>Método</th><td mat-cell *matCellDef="let payment">{{ payment.method }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Estado</th><td mat-cell *matCellDef="let payment"><ct-status-badge [label]="payment.status" [tone]="payment.status === 'FAILED' ? 'danger' : payment.status === 'PAID' ? 'success' : 'warning'" /></td></ng-container>
          <ng-container matColumnDef="created_at"><th mat-header-cell *matHeaderCellDef>Fecha</th><td mat-cell *matCellDef="let payment">{{ payment.created_at | date: 'short' }}</td></ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: ['.form-card,.table-card{padding:1.5rem}.selector{display:flex;gap:1rem;align-items:center;flex-wrap:wrap}.selector mat-form-field{min-width:280px}table{width:100%}'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentListComponent implements OnInit {
  protected readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  protected readonly selectorForm = this.fb.group({
    orderId: ['']
  });
  protected readonly orders$ = this.store.select(selectAllOrders);
  protected readonly payments$ = this.store.select(selectAllPayments);
  protected readonly filteredPayments$ = combineLatest([
    this.payments$,
    this.selectorForm.valueChanges.pipe(startWith(this.selectorForm.value))
  ]).pipe(
    map(([payments]) => {
      const orderId = this.selectorForm.value.orderId;
      return orderId ? payments.filter((payment) => payment.order_id === orderId) : payments;
    })
  );
  protected readonly displayedColumns = ['order', 'products', 'amount', 'method', 'status', 'created_at'];

  ngOnInit(): void {
    this.store.dispatch(ordersActions.loadOrders());
    this.store.dispatch(paymentsActions.loadPayments());

    const orderId = this.route.snapshot.queryParamMap.get('orderId');
    if (orderId) {
      this.selectorForm.patchValue({ orderId });
    }
  }

  protected loadPayments(orderId: string): void {
    if (orderId) {
      this.store.dispatch(paymentsActions.loadPaymentsByOrder({ orderId }));
      return;
    }

    this.store.dispatch(paymentsActions.loadPayments());
  }

  protected productNames(payment: Payment): string {
    if (!payment.products?.length) {
      return 'Sin productos';
    }

    return payment.products
      .map((product) => product.product_name?.trim() || 'Sin nombre')
      .join(', ');
  }
}
