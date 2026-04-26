import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { positiveNumberValidator } from '../../../../shared/validators/positive-number.validator';
import { paymentsActions } from '../../store/payments.actions';

@Component({
  selector: 'ct-payment-form',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  template: `
    <mat-card class="page-card form-card">
      <h1>Registrar pago</h1>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="outline"><mat-label>Monto</mat-label><input matInput type="number" formControlName="amount" /></mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Método</mat-label>
          <mat-select formControlName="method">
            <mat-option *ngFor="let option of methods" [value]="option">{{ option }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Estado</mat-label>
          <mat-select formControlName="status">
            <mat-option *ngFor="let option of statuses" [value]="option">{{ option }}</mat-option>
          </mat-select>
        </mat-form-field>
        <div class="actions">
          <button mat-stroked-button type="button" (click)="cancel()">Cancelar</button>
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
        </div>
      </form>
    </mat-card>
  `,
  styles: ['.form-card{max-width:680px;padding:1.5rem}form{display:grid;gap:1rem}.actions{display:flex;justify-content:flex-end;gap:.75rem}'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentFormComponent implements OnInit {
  protected readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private orderId = '';
  protected readonly methods = ['CASH', 'TRANSFER', 'NEQUI', 'DAVIPLATA', 'CARD', 'OTHER'];
  protected readonly statuses = ['PENDING', 'PAID', 'PARTIAL', 'FAILED', 'REFUNDED'];

  protected readonly form = this.fb.nonNullable.group({
    amount: [0, [Validators.required, positiveNumberValidator]],
    method: this.fb.nonNullable.control<'CASH' | 'TRANSFER' | 'NEQUI' | 'DAVIPLATA' | 'CARD' | 'OTHER'>('CASH', Validators.required),
    status: this.fb.nonNullable.control<'PENDING' | 'PAID' | 'PARTIAL' | 'FAILED' | 'REFUNDED'>('PENDING', Validators.required)
  });

  ngOnInit(): void {
    this.orderId = this.route.snapshot.queryParamMap.get('orderId') ?? '';
  }

  protected submit(): void {
    if (this.form.invalid || !this.orderId) {
      this.form.markAllAsTouched();
      return;
    }
    this.store.dispatch(paymentsActions.createPayment({ payload: { ...this.form.getRawValue(), order_id: this.orderId } }));
    this.router.navigate(['/payments'], { queryParams: { orderId: this.orderId } });
  }

  protected cancel(): void {
    this.router.navigate(['/payments'], { queryParams: { orderId: this.orderId } });
  }
}
