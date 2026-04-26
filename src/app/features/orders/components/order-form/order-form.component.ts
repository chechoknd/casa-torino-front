import { AsyncPipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { OrderItemPayload } from '../../../../core/models/order.model';
import { customersActions } from '../../../customers/store/customers.actions';
import { selectActiveCustomers } from '../../../customers/store/customers.selectors';
import { productsActions } from '../../../products/store/products.actions';
import { selectActiveProducts } from '../../../products/store/products.selectors';
import { positiveNumberValidator } from '../../../../shared/validators/positive-number.validator';
import { ordersActions } from '../../store/orders.actions';

@Component({
  selector: 'ct-order-form',
  standalone: true,
  imports: [AsyncPipe, NgFor, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule],
  template: `
    <mat-card class="page-card form-card">
      <h1>Nuevo pedido</h1>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="outline">
          <mat-label>Cliente</mat-label>
          <mat-select formControlName="customer_id">
            <mat-option *ngFor="let customer of customers$ | async" [value]="customer.id">{{ customer.full_name }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Descuento</mat-label><input matInput type="number" formControlName="discount" /></mat-form-field>

        <div class="items-header">
          <h2>Productos</h2>
          <button mat-stroked-button type="button" (click)="addItem()"><mat-icon>add</mat-icon>Agregar producto</button>
        </div>

        <div formArrayName="items" class="items">
          <div class="item-row" *ngFor="let item of items.controls; let i = index" [formGroupName]="i">
            <mat-form-field appearance="outline">
              <mat-label>Producto</mat-label>
              <mat-select formControlName="product_id">
                <mat-option *ngFor="let product of products$ | async" [value]="product.id">{{ product.name }}</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Cantidad</mat-label><input matInput type="number" formControlName="quantity" /></mat-form-field>
            <button mat-icon-button color="warn" type="button" (click)="removeItem(i)"><mat-icon>delete</mat-icon></button>
          </div>
        </div>

        <div class="actions">
          <button mat-stroked-button type="button" (click)="router.navigate(['/orders'])">Cancelar</button>
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || !items.length">Guardar</button>
        </div>
      </form>
    </mat-card>
  `,
  styles: ['.form-card{padding:1.5rem}.items-header,.item-row,.actions{display:flex;gap:1rem;align-items:center}.item-row{margin-bottom:1rem}.item-row mat-form-field{flex:1}.actions{justify-content:flex-end}.items{display:grid}'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderFormComponent implements OnInit {
  protected readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  protected readonly customers$ = this.store.select(selectActiveCustomers);
  protected readonly products$ = this.store.select(selectActiveProducts);

  protected readonly form = this.fb.nonNullable.group({
    customer_id: ['', Validators.required],
    discount: [0, [positiveNumberValidator]],
    items: this.fb.array([])
  });

  get items(): FormArray {
    return this.form.controls.items as FormArray;
  }

  ngOnInit(): void {
    this.store.dispatch(customersActions.loadCustomers());
    this.store.dispatch(productsActions.loadProducts());
    this.addItem();
  }

  protected addItem(): void {
    this.items.push(
      this.fb.nonNullable.group({
        product_id: ['', Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]]
      })
    );
  }

  protected removeItem(index: number): void {
    this.items.removeAt(index);
  }

  protected submit(): void {
    if (this.form.invalid || !this.items.length) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    this.store.dispatch(
      ordersActions.createOrder({
        payload: {
          customer_id: raw.customer_id,
          discount: raw.discount ?? 0,
          items: raw.items as OrderItemPayload[]
        }
      })
    );
    this.router.navigate(['/orders']);
  }
}
