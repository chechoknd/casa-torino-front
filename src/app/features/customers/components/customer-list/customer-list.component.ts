import { AsyncPipe, DatePipe } from '@angular/common';
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
import { customersActions } from '../../store/customers.actions';
import { selectAllCustomers } from '../../store/customers.selectors';

@Component({
  selector: 'ct-customer-list',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    EntityToolbarComponent,
    StatusBadgeComponent
  ],
  template: `
    <div class="page-shell">
      <ct-entity-toolbar
        title="Clientes"
        subtitle="Administra la base activa e historial comercial."
        actionLabel="Nuevo cliente"
        (create)="router.navigate(['/customers/new'])"
      />

      <section class="page-card table-card">
        <table mat-table [dataSource]="(pagedCustomers$ | async) ?? []">
          <ng-container matColumnDef="full_name">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let customer">{{ customer.full_name }}</td>
          </ng-container>
          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef>Teléfono</th>
            <td mat-cell *matCellDef="let customer">{{ customer.phone }}</td>
          </ng-container>
          <ng-container matColumnDef="customer_type">
            <th mat-header-cell *matHeaderCellDef>Tipo</th>
            <td mat-cell *matCellDef="let customer">{{ customer.customer_type }}</td>
          </ng-container>
          <ng-container matColumnDef="is_active">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let customer">
              <ct-status-badge
                [label]="customer.is_active ? 'Activo' : 'Inactivo'"
                [tone]="customer.is_active ? 'success' : 'muted'"
              />
            </td>
          </ng-container>
          <ng-container matColumnDef="created_at">
            <th mat-header-cell *matHeaderCellDef>Registro</th>
            <td mat-cell *matCellDef="let customer">{{ customer.created_at | date: 'short' }}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let customer">
              <button mat-icon-button (click)="router.navigate(['/customers', customer.id])"><mat-icon>visibility</mat-icon></button>
              <button mat-icon-button (click)="router.navigate(['/customers/edit', customer.id])"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" (click)="confirmDeactivate(customer.id)"><mat-icon>block</mat-icon></button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>

        <mat-paginator
          [length]="total$ | async"
          [pageSize]="pageSize"
          [pageSizeOptions]="[5, 10, 20]"
          (page)="onPageChange($event)"
        />
      </section>
    </div>
  `,
  styles: [
    `
      .table-card {
        overflow: hidden;
        padding: 0.75rem;
      }

      table {
        width: 100%;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerListComponent implements OnInit {
  protected readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly store = inject(Store);
  protected readonly displayedColumns = ['full_name', 'phone', 'customer_type', 'is_active', 'created_at', 'actions'];
  protected pageIndex = 0;
  protected pageSize = 10;
  private readonly customers$ = this.store.select(selectAllCustomers);
  protected readonly total$ = this.customers$.pipe(map((customers) => customers.length));
  protected readonly pagedCustomers$ = this.customers$.pipe(
    map((customers) => customers.slice(this.pageIndex * this.pageSize, this.pageIndex * this.pageSize + this.pageSize))
  );

  ngOnInit(): void {
    this.store.dispatch(customersActions.loadCustomers());
  }

  protected onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.store.dispatch(customersActions.loadCustomers());
  }

  protected confirmDeactivate(id: string): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Desactivar cliente',
          message: 'El cliente se mantendrá en historial, pero dejará de aparecer como activo.',
          confirmText: 'Desactivar'
        }
      })
      .afterClosed()
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.store.dispatch(customersActions.deactivateCustomer({ id }));
        }
      });
  }
}
