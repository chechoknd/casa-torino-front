import { NgIf } from '@angular/common';
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
import { customersActions } from '../../store/customers.actions';
import { selectCustomerById } from '../../store/customers.selectors';

@Component({
  selector: 'ct-customer-form',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  template: `
    <mat-card class="page-card form-card">
      <h1>{{ editing ? 'Editar cliente' : 'Nuevo cliente' }}</h1>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="outline">
          <mat-label>Nombre completo</mat-label>
          <input matInput formControlName="full_name" />
          <mat-error *ngIf="form.controls.full_name.invalid">Campo obligatorio.</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Teléfono</mat-label>
          <input matInput formControlName="phone" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" />
          <mat-error *ngIf="form.controls.email.invalid">Correo no válido.</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Tipo</mat-label>
          <mat-select formControlName="customer_type">
            <mat-option value="PERSON">PERSON</mat-option>
            <mat-option value="COMPANY">COMPANY</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="actions">
          <button mat-stroked-button type="button" (click)="router.navigate(['/customers'])">Cancelar</button>
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
        </div>
      </form>
    </mat-card>
  `,
  styles: [
    `
      .form-card {
        max-width: 760px;
        padding: 1.5rem;
      }

      form {
        display: grid;
        gap: 1rem;
      }

      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerFormComponent implements OnInit {
  protected readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  protected editing = false;
  private customerId: string | null = null;

  protected readonly form = this.fb.nonNullable.group({
    full_name: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    customer_type: this.fb.nonNullable.control<'PERSON' | 'COMPANY'>('PERSON', Validators.required)
  });

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('id');
    this.editing = Boolean(this.customerId);

    if (this.customerId) {
      this.store.dispatch(customersActions.loadCustomers());
      this.store
        .select(selectCustomerById(this.customerId))
        .pipe(
          filter((customer) => Boolean(customer)),
          take(1)
        )
        .subscribe((customer) => {
          this.form.patchValue(customer!);
        });
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.customerId) {
      this.store.dispatch(customersActions.updateCustomer({ id: this.customerId, payload: this.form.getRawValue() }));
    } else {
      this.store.dispatch(customersActions.createCustomer({ payload: this.form.getRawValue() }));
    }

    this.router.navigate(['/customers']);
  }
}
