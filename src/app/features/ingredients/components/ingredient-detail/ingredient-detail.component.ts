import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { CurrencyCopPipe } from '../../../../shared/pipes/currency-cop.pipe';
import { ingredientsActions } from '../../store/ingredients.actions';
import { selectSelectedIngredient } from '../../store/ingredients.selectors';

@Component({
  selector: 'ct-ingredient-detail',
  standalone: true,
  imports: [AsyncPipe, NgIf, RouterLink, MatButtonModule, MatCardModule, CurrencyCopPipe],
  template: `
    <mat-card class="page-card detail-card" *ngIf="ingredient$ | async as ingredient">
      <h1>{{ ingredient.name }}</h1>
      <p>Unidad: {{ ingredient.unit }}</p>
      <p>Costo promedio: {{ ingredient.average_cost | currencyCop }}</p>
      <p>Stock actual: {{ ingredient.stock }}</p>
      <p>Stock mínimo: {{ ingredient.minimum_stock }}</p>
      <p>Estado: {{ ingredient.is_active ? 'Activo' : 'Inactivo' }}</p>
      <a mat-stroked-button [routerLink]="['/ingredients/edit', ingredient.id]">Editar</a>
    </mat-card>
  `,
  styles: ['.detail-card{padding:1.5rem}'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IngredientDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  protected readonly ingredient$ = this.store.select(selectSelectedIngredient);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(ingredientsActions.loadIngredientDetail({ id }));
    }
  }
}

