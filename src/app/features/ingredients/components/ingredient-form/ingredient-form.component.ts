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
import { ingredientsActions } from '../../store/ingredients.actions';
import { selectIngredientById } from '../../store/ingredients.selectors';

@Component({
  selector: 'ct-ingredient-form',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  template: `
    <mat-card class="page-card form-card">
      <h1>{{ editing ? 'Editar ingrediente' : 'Nuevo ingrediente' }}</h1>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="outline"><mat-label>Nombre</mat-label><input matInput formControlName="name" /></mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Unidad</mat-label>
          <mat-select formControlName="unit">
            <mat-option *ngFor="let option of units" [value]="option">{{ option }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Costo promedio</mat-label><input matInput type="number" formControlName="average_cost" /></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Stock actual</mat-label><input matInput type="number" formControlName="stock" /></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Stock mínimo</mat-label><input matInput type="number" formControlName="minimum_stock" /></mat-form-field>
        <div class="actions">
          <button mat-stroked-button type="button" (click)="router.navigate(['/ingredients'])">Cancelar</button>
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
        </div>
      </form>
    </mat-card>
  `,
  styles: ['.form-card{max-width:760px;padding:1.5rem} form{display:grid;gap:1rem}.actions{display:flex;justify-content:flex-end;gap:.75rem}'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IngredientFormComponent implements OnInit {
  protected readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  protected readonly units = ['G', 'ML', 'UNIT', 'KG', 'L'];
  protected editing = false;
  private ingredientId: string | null = null;

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    unit: this.fb.nonNullable.control<'G' | 'ML' | 'UNIT' | 'KG' | 'L'>('UNIT', Validators.required),
    average_cost: [0, [Validators.required, positiveNumberValidator]],
    stock: [0, [Validators.required, positiveNumberValidator]],
    minimum_stock: [0, [Validators.required, positiveNumberValidator]]
  });

  ngOnInit(): void {
    this.ingredientId = this.route.snapshot.paramMap.get('id');
    this.editing = Boolean(this.ingredientId);
    if (this.ingredientId) {
      this.store.dispatch(ingredientsActions.loadIngredients());
      this.store.select(selectIngredientById(this.ingredientId)).pipe(filter(Boolean), take(1)).subscribe((ingredient) => this.form.patchValue(ingredient!));
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.getRawValue();
    if (this.ingredientId) {
      this.store.dispatch(ingredientsActions.updateIngredient({ id: this.ingredientId, payload }));
    } else {
      this.store.dispatch(ingredientsActions.createIngredient({ payload }));
    }
    this.router.navigate(['/ingredients']);
  }
}
