import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { CurrencyCopPipe } from '../../../../shared/pipes/currency-cop.pipe';
import { recipesActions } from '../../store/recipes.actions';
import { selectSelectedRecipe } from '../../store/recipes.selectors';

@Component({
  selector: 'ct-recipe-detail',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, MatCardModule, CurrencyCopPipe],
  template: `
    <div class="page-shell" *ngIf="recipe$ | async as recipe">
      <mat-card class="page-card detail-card">
        <h1>{{ recipe.name }}</h1>
        <p>Producto: {{ recipe.product_name ?? 'Producto sin nombre' }}</p>
        <p>Porciones: {{ recipe.servings }}</p>
        <p>Costo calculado: {{ recipe.cost ?? 0 | currencyCop }}</p>
      </mat-card>
      <mat-card class="page-card detail-card">
        <h2>Ingredientes</h2>
        <div class="row" *ngFor="let item of recipe.items">
          <span>{{ item.ingredient_id }}</span>
          <span>{{ item.quantity }} {{ item.unit }}</span>
        </div>
      </mat-card>
    </div>
  `,
  styles: ['.detail-card{padding:1.5rem}.row{display:flex;justify-content:space-between;gap:1rem;padding:.8rem 0;border-bottom:1px solid var(--ct-border)}'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  protected readonly recipe$ = this.store.select(selectSelectedRecipe);

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('productId');
    if (productId) {
      this.store.dispatch(recipesActions.loadRecipeDetail({ productId }));
    }
  }
}
