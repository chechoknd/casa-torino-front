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
import { RecipeItem } from '../../../../core/models/recipe.model';
import { ingredientsActions } from '../../../ingredients/store/ingredients.actions';
import { selectActiveIngredients } from '../../../ingredients/store/ingredients.selectors';
import { productsActions } from '../../../products/store/products.actions';
import { selectActiveProducts } from '../../../products/store/products.selectors';
import { positiveNumberValidator } from '../../../../shared/validators/positive-number.validator';
import { recipesActions } from '../../store/recipes.actions';

@Component({
  selector: 'ct-recipe-form',
  standalone: true,
  imports: [AsyncPipe, NgFor, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule],
  template: `
    <mat-card class="page-card form-card">
      <h1>Nueva receta</h1>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="outline"><mat-label>Nombre</mat-label><input matInput formControlName="name" /></mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Producto asociado</mat-label>
          <mat-select formControlName="product_id">
            <mat-option *ngFor="let product of products$ | async" [value]="product.id">{{ product.name }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Porciones</mat-label><input matInput type="number" formControlName="servings" /></mat-form-field>

        <div class="items-header">
          <h2>Ingredientes</h2>
          <button mat-stroked-button type="button" (click)="addItem()"><mat-icon>add</mat-icon>Agregar ingrediente</button>
        </div>

        <div formArrayName="items">
          <div class="item-row" *ngFor="let item of items.controls; let i = index" [formGroupName]="i">
            <mat-form-field appearance="outline">
              <mat-label>Ingrediente</mat-label>
              <mat-select formControlName="ingredient_id">
                <mat-option *ngFor="let ingredient of ingredients$ | async" [value]="ingredient.id">{{ ingredient.name }}</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Cantidad</mat-label><input matInput type="number" formControlName="quantity" /></mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Unidad</mat-label>
              <mat-select formControlName="unit">
                <mat-option *ngFor="let option of units" [value]="option">{{ option }}</mat-option>
              </mat-select>
            </mat-form-field>
            <button mat-icon-button color="warn" type="button" aria-label="Eliminar ingrediente" (click)="removeItem(i)"><mat-icon>delete</mat-icon></button>
          </div>
        </div>

        <div class="actions">
          <button mat-stroked-button type="button" (click)="router.navigate(['/recipes'])">Cancelar</button>
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || !items.length">Guardar</button>
        </div>
      </form>
    </mat-card>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeFormComponent implements OnInit {
  protected readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  protected readonly products$ = this.store.select(selectActiveProducts);
  protected readonly ingredients$ = this.store.select(selectActiveIngredients);
  protected readonly units = ['G', 'ML', 'UNIT', 'KG', 'L'];

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    product_id: ['', Validators.required],
    servings: [1, [Validators.required, Validators.min(1)]],
    items: this.fb.array([])
  });

  get items(): FormArray {
    return this.form.controls.items as FormArray;
  }

  ngOnInit(): void {
    this.store.dispatch(productsActions.loadProducts());
    this.store.dispatch(ingredientsActions.loadIngredients());
    this.addItem();
  }

  protected addItem(): void {
    this.items.push(
      this.fb.nonNullable.group({
        ingredient_id: ['', Validators.required],
        quantity: [0, [Validators.required, positiveNumberValidator]],
        unit: this.fb.nonNullable.control<'G' | 'ML' | 'UNIT' | 'KG' | 'L'>('G', Validators.required)
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
      recipesActions.createRecipe({
        payload: {
          name: raw.name,
          product_id: raw.product_id,
          servings: raw.servings,
          items: raw.items as RecipeItem[]
        }
      })
    );
  }
}
