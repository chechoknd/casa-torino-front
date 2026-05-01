import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { CurrencyCopPipe } from '../../../../shared/pipes/currency-cop.pipe';
import { EntityToolbarComponent } from '../../../../shared/components/entity-toolbar/entity-toolbar.component';
import { recipesActions } from '../../store/recipes.actions';
import { selectAllRecipes } from '../../store/recipes.selectors';

@Component({
  selector: 'ct-recipe-list',
  standalone: true,
  imports: [AsyncPipe, MatButtonModule, MatIconModule, MatPaginatorModule, MatTableModule, CurrencyCopPipe, EntityToolbarComponent],
  template: `
    <div class="page-shell">
      <ct-entity-toolbar title="Recetas" subtitle="Composición, porciones y costo calculado." actionLabel="Nueva receta" (create)="router.navigate(['/recipes/new'])" />
      <section class="page-card table-card">
        <table mat-table [dataSource]="(pagedRecipes$ | async) ?? []">
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Nombre</th><td mat-cell *matCellDef="let recipe">{{ recipe.name }}</td></ng-container>
          <ng-container matColumnDef="product_name"><th mat-header-cell *matHeaderCellDef>Producto</th><td mat-cell *matCellDef="let recipe">{{ recipe.product_name ?? 'Producto sin nombre' }}</td></ng-container>
          <ng-container matColumnDef="servings"><th mat-header-cell *matHeaderCellDef>Porciones</th><td mat-cell *matCellDef="let recipe">{{ recipe.servings }}</td></ng-container>
          <ng-container matColumnDef="cost"><th mat-header-cell *matHeaderCellDef>Costo API</th><td mat-cell *matCellDef="let recipe">{{ recipe.cost ?? 0 | currencyCop }}</td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let recipe"><button mat-icon-button (click)="router.navigate(['/recipes', recipe.product_id])"><mat-icon>visibility</mat-icon></button></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
        <mat-paginator [length]="total$ | async" [pageSize]="pageSize" [pageSizeOptions]="[5,10,20]" (page)="onPageChange($event)" />
      </section>
    </div>
  `,
  styles: ['.table-card{padding:.75rem;overflow:hidden}table{width:100%}'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeListComponent implements OnInit {
  protected readonly router = inject(Router);
  private readonly store = inject(Store);
  protected readonly displayedColumns = ['name', 'product_name', 'servings', 'cost', 'actions'];
  protected pageIndex = 0;
  protected pageSize = 10;
  private readonly recipes$ = this.store.select(selectAllRecipes);
  protected readonly total$ = this.recipes$.pipe(map((recipes) => recipes.length));
  protected readonly pagedRecipes$ = this.recipes$.pipe(
    map((recipes) => recipes.slice(this.pageIndex * this.pageSize, this.pageIndex * this.pageSize + this.pageSize))
  );

  ngOnInit(): void {
    this.store.dispatch(recipesActions.loadRecipes());
  }

  protected onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.store.dispatch(recipesActions.loadRecipes());
  }
}
