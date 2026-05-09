import { AsyncPipe } from '@angular/common';
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
import { productsActions } from '../../store/products.actions';
import { selectAllProducts } from '../../store/products.selectors';

@Component({
  selector: 'ct-product-list',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    EntityToolbarComponent,
    StatusBadgeComponent,
    CurrencyCopPipe
  ],
  template: `
    <div class="page-shell">
      <ct-entity-toolbar
        title="Productos"
        subtitle="Precios base, costos y disponibilidad comercial."
        actionLabel="Nuevo producto"
        (create)="router.navigate(['/products/new'])"
      />
      <section class="page-card table-card">
        <table mat-table [dataSource]="(pagedProducts$ | async) ?? []">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let product">{{ product.name }}</td>
          </ng-container>
          <ng-container matColumnDef="product_type">
            <th mat-header-cell *matHeaderCellDef>Tipo</th>
            <td mat-cell *matCellDef="let product">{{ product.product_type }}</td>
          </ng-container>
          <ng-container matColumnDef="base_price">
            <th mat-header-cell *matHeaderCellDef>Precio base</th>
            <td mat-cell *matCellDef="let product">{{ product.base_price | currencyCop }}</td>
          </ng-container>
          <ng-container matColumnDef="cost_price">
            <th mat-header-cell *matHeaderCellDef>Costo</th>
            <td mat-cell *matCellDef="let product">{{ product.cost_price | currencyCop }}</td>
          </ng-container>
          <ng-container matColumnDef="is_active">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let product">
              <ct-status-badge [label]="product.is_active ? 'Activo' : 'Inactivo'" [tone]="product.is_active ? 'success' : 'muted'" />
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let product">
              <button mat-icon-button aria-label="Ver producto" (click)="router.navigate(['/products', product.id])"><mat-icon>visibility</mat-icon></button>
              <button mat-icon-button aria-label="Editar producto" (click)="router.navigate(['/products/edit', product.id])"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button aria-label="Desactivar producto" color="warn" (click)="confirmDeactivate(product.id)"><mat-icon>block</mat-icon></button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
        <mat-paginator [length]="total$ | async" [pageSize]="pageSize" [pageSizeOptions]="[5,10,20]" (page)="onPageChange($event)" />
      </section>
    </div>
  `,
  styles: ['.table-card{padding:0.75rem;overflow-x:auto;overflow-y:visible} table{width:100%}'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {
  protected readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly store = inject(Store);
  protected readonly displayedColumns = ['name', 'product_type', 'base_price', 'cost_price', 'is_active', 'actions'];
  protected pageIndex = 0;
  protected pageSize = 10;
  private readonly products$ = this.store.select(selectAllProducts);
  protected readonly total$ = this.products$.pipe(map((products) => products.length));
  protected readonly pagedProducts$ = this.products$.pipe(
    map((products) => products.slice(this.pageIndex * this.pageSize, this.pageIndex * this.pageSize + this.pageSize))
  );

  ngOnInit(): void {
    this.store.dispatch(productsActions.loadProducts());
  }

  protected onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.store.dispatch(productsActions.loadProducts());
  }

  protected confirmDeactivate(id: string): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Desactivar producto', message: 'El producto se ocultará de las listas activas.', confirmText: 'Desactivar' }
    }).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.store.dispatch(productsActions.deactivateProduct({ id }));
      }
    });
  }
}
