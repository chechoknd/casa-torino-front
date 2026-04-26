import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { customersActions } from '../../../customers/store/customers.actions';
import { productsActions } from '../../../products/store/products.actions';
import { ordersActions } from '../../../orders/store/orders.actions';
import { selectAllOrders } from '../../../orders/store/orders.selectors';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { CurrencyCopPipe } from '../../../../shared/pipes/currency-cop.pipe';
import { positiveNumberValidator } from '../../../../shared/validators/positive-number.validator';
import { paymentsActions } from '../../store/payments.actions';
import { selectAllPayments } from '../../store/payments.selectors';

@Component({
  selector: 'ct-payment-list',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgFor, NgIf, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatTableModule, StatusBadgeComponent, CurrencyCopPipe],
  template: `
    <div class="page-shell">
      <mat-card class="page-card form-card">
        <h1>Pagos</h1>
        <form [formGroup]="selectorForm" class="selector">
          <mat-form-field appearance="outline">
            <mat-label>Pedido</mat-label>
            <mat-select formControlName="orderId" (valueChange)="loadPayments($event)">
              <mat-option *ngFor="let order of orders$ | async" [value]="order.id">{{ order.id }} · {{ order.total | currencyCop }}</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-flat-button color="primary" type="button" (click)="router.navigate(['/payments/new'], { queryParams: { orderId: selectorForm.value.orderId } })" [disabled]="!selectorForm.value.orderId">
            Registrar pago
          </button>
        </form>
      </mat-card>

      <mat-card class="page-card table-card" *ngIf="selectorForm.value.orderId">
        <table mat-table [dataSource]="(payments$ | async) ?? []">
          <ng-container matColumnDef="amount"><th mat-header-cell *matHeaderCellDef>Monto</th><td mat-cell *matCellDef="let payment">{{ payment.amount | currencyCop }}</td></ng-container>
          <ng-container matColumnDef="method"><th mat-header-cell *matHeaderCellDef>Método</th><td mat-cell *matCellDef="let payment">{{ payment.method }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Estado</th><td mat-cell *matCellDef="let payment"><ct-status-badge [label]="payment.status" [tone]="payment.status === 'FAILED' ? 'danger' : payment.status === 'PAID' ? 'success' : 'warning'" /></td></ng-container>
          <ng-container matColumnDef="created_at"><th mat-header-cell *matHeaderCellDef>Fecha</th><td mat-cell *matCellDef="let payment">{{ payment.created_at | date: 'short' }}</td></ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let payment">
              <mat-form-field appearance="outline" class="inline-status">
                <mat-select [value]="payment.status" (valueChange)="updateStatus(payment.id, $event)">
                  <mat-option *ngFor="let status of statuses" [value]="status">{{ status }}</mat-option>
                </mat-select>
              </mat-form-field>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: ['.form-card,.table-card{padding:1.5rem}.selector{display:flex;gap:1rem;align-items:center;flex-wrap:wrap}.selector mat-form-field{min-width:280px}.inline-status{width:180px}table{width:100%}'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentListComponent implements OnInit {
  protected readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  protected readonly orders$ = this.store.select(selectAllOrders);
  protected readonly payments$ = this.store.select(selectAllPayments);
  protected readonly displayedColumns = ['amount', 'method', 'status', 'created_at', 'actions'];
  protected readonly statuses = ['PENDING', 'PAID', 'PARTIAL', 'FAILED', 'REFUNDED'];

  protected readonly selectorForm = this.fb.group({
    orderId: ['', Validators.required]
  });

  ngOnInit(): void {
    this.store.dispatch(customersActions.loadCustomers());
    this.store.dispatch(productsActions.loadProducts());
    this.store.dispatch(ordersActions.loadOrders());

    const orderId = this.route.snapshot.queryParamMap.get('orderId');
    if (orderId) {
      this.selectorForm.patchValue({ orderId });
      this.loadPayments(orderId);
    }
  }

  protected loadPayments(orderId: string): void {
    if (orderId) {
      this.store.dispatch(paymentsActions.loadPaymentsByOrder({ orderId }));
    }
  }

  protected updateStatus(id: string, status: 'PENDING' | 'PAID' | 'PARTIAL' | 'FAILED' | 'REFUNDED'): void {
    const orderId = this.selectorForm.value.orderId;
    if (orderId) {
      this.store.dispatch(paymentsActions.updatePaymentStatus({ id, orderId, status }));
    }
  }
}
