import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EntityToolbarComponent } from '../../../../shared/components/entity-toolbar/entity-toolbar.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { CurrencyCopPipe } from '../../../../shared/pipes/currency-cop.pipe';
import { ingredientsActions } from '../../store/ingredients.actions';
import { selectAllIngredients } from '../../store/ingredients.selectors';

@Component({
  selector: 'ct-ingredient-list',
  standalone: true,
  imports: [AsyncPipe, NgClass, MatButtonModule, MatIconModule, MatPaginatorModule, MatTableModule, EntityToolbarComponent, StatusBadgeComponent, CurrencyCopPipe],
  template: `
    <div class="page-shell">
      <ct-entity-toolbar
        title="Ingredientes"
        subtitle="Stock, costo promedio y alertas de reposición."
        actionLabel="Nuevo ingrediente"
        (create)="router.navigate(['/ingredients/new'])"
      />

      <section class="page-card table-card">
        <table mat-table [dataSource]="(pagedIngredients$ | async) ?? []">
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Nombre</th><td mat-cell *matCellDef="let ingredient">{{ ingredient.name }}</td></ng-container>
          <ng-container matColumnDef="unit"><th mat-header-cell *matHeaderCellDef>Unidad</th><td mat-cell *matCellDef="let ingredient">{{ ingredient.unit }}</td></ng-container>
          <ng-container matColumnDef="average_cost"><th mat-header-cell *matHeaderCellDef>Costo promedio</th><td mat-cell *matCellDef="let ingredient">{{ ingredient.average_cost | currencyCop }}</td></ng-container>
          <ng-container matColumnDef="stock"><th mat-header-cell *matHeaderCellDef>Stock</th><td mat-cell *matCellDef="let ingredient" [ngClass]="{ low: ingredient.stock <= ingredient.minimum_stock }">{{ ingredient.stock }}</td></ng-container>
          <ng-container matColumnDef="minimum_stock"><th mat-header-cell *matHeaderCellDef>Mínimo</th><td mat-cell *matCellDef="let ingredient">{{ ingredient.minimum_stock }}</td></ng-container>
          <ng-container matColumnDef="alert"><th mat-header-cell *matHeaderCellDef>Alerta</th><td mat-cell *matCellDef="let ingredient"><ct-status-badge [label]="ingredient.stock <= ingredient.minimum_stock ? 'Bajo mínimo' : 'OK'" [tone]="ingredient.stock <= ingredient.minimum_stock ? 'danger' : 'success'" /></td></ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let ingredient">
              <button mat-icon-button aria-label="Ver ingrediente" (click)="router.navigate(['/ingredients', ingredient.id])"><mat-icon>visibility</mat-icon></button>
              <button mat-icon-button aria-label="Editar ingrediente" (click)="router.navigate(['/ingredients/edit', ingredient.id])"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button aria-label="Desactivar ingrediente" color="warn" (click)="confirmDeactivate(ingredient.id)"><mat-icon>block</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
        <mat-paginator [length]="total$ | async" [pageSize]="pageSize" [pageSizeOptions]="[5,10,20]" (page)="onPageChange($event)" />
      </section>
    </div>
  `,
  styles: ['.table-card{padding:.75rem;overflow-x:auto;overflow-y:visible}table{width:100%}.low{color:var(--ct-danger);font-weight:700}'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IngredientListComponent implements OnInit {
  protected readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly store = inject(Store);
  protected readonly displayedColumns = ['name', 'unit', 'average_cost', 'stock', 'minimum_stock', 'alert', 'actions'];
  protected pageIndex = 0;
  protected pageSize = 10;
  private readonly ingredients$ = this.store.select(selectAllIngredients);
  protected readonly total$ = this.ingredients$.pipe(map((ingredients) => ingredients.length));
  protected readonly pagedIngredients$ = this.ingredients$.pipe(
    map((ingredients) => ingredients.slice(this.pageIndex * this.pageSize, this.pageIndex * this.pageSize + this.pageSize))
  );

  ngOnInit(): void {
    this.store.dispatch(ingredientsActions.loadIngredients());
  }

  protected onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.store.dispatch(ingredientsActions.loadIngredients());
  }

  protected confirmDeactivate(id: string): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Desactivar ingrediente', message: 'Seguirá disponible en historial de recetas.', confirmText: 'Desactivar' }
    }).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.store.dispatch(ingredientsActions.deactivateIngredient({ id }));
      }
    });
  }
}
