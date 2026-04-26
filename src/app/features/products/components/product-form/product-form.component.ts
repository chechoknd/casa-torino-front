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
import { filter, take } from 'rxjs';
import { positiveNumberValidator } from '../../../../shared/validators/positive-number.validator';
import { productsActions } from '../../store/products.actions';
import { selectProductById } from '../../store/products.selectors';

@Component({
  selector: 'ct-product-form',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  template: `
    <mat-card class="page-card form-card">
      <h1>{{ editing ? 'Editar producto' : 'Nuevo producto' }}</h1>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="outline"><mat-label>Nombre</mat-label><input matInput formControlName="name" /></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Descripción</mat-label><textarea matInput rows="4" formControlName="description"></textarea></mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Tipo</mat-label>
          <mat-select formControlName="product_type">
            <mat-option *ngFor="let option of productTypes" [value]="option">{{ option }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Precio base</mat-label><input matInput type="number" formControlName="base_price" /></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Precio costo</mat-label><input matInput type="number" formControlName="cost_price" /></mat-form-field>
        <div class="actions">
          <button mat-stroked-button type="button" (click)="router.navigate(['/products'])">Cancelar</button>
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
        </div>
      </form>
    </mat-card>
  `,
  styles: ['.form-card{max-width:760px;padding:1.5rem} form{display:grid;gap:1rem}.actions{display:flex;justify-content:flex-end;gap:.75rem}'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFormComponent implements OnInit {
  protected readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  protected readonly productTypes = ['LUNCH', 'JUICE', 'CAKE', 'EVENT', 'PLAN', 'VACUUM_PACKED'];
  protected editing = false;
  private productId: string | null = null;

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    product_type: this.fb.nonNullable.control<'LUNCH' | 'JUICE' | 'CAKE' | 'EVENT' | 'PLAN' | 'VACUUM_PACKED'>('LUNCH', Validators.required),
    base_price: [0, [Validators.required, positiveNumberValidator]],
    cost_price: [0, [Validators.required, positiveNumberValidator]]
  });

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.editing = Boolean(this.productId);
    if (this.productId) {
      this.store.dispatch(productsActions.loadProducts());
      this.store.select(selectProductById(this.productId)).pipe(filter(Boolean), take(1)).subscribe((product) => this.form.patchValue(product!));
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.getRawValue();
    if (this.productId) {
      this.store.dispatch(productsActions.updateProduct({ id: this.productId, payload }));
    } else {
      this.store.dispatch(productsActions.createProduct({ payload }));
    }
    this.router.navigate(['/products']);
  }
}
