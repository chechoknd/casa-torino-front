import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { finalize } from 'rxjs';
import { mapApiErrorMessage } from '../../core/auth/auth-error.util';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'ct-login',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule],
  template: `
    <main class="login-page">
      <section class="login-panel page-card">
        <div class="login-copy">
          <span class="eyebrow">Casa Torino</span>
          <h1>Panel administrativo</h1>
          <p>Ingresa con tu usuario para gestionar clientes, cocina, pedidos y pagos.</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="login-form">
          <mat-form-field appearance="outline">
            <mat-label>Email o usuario</mat-label>
            <input matInput type="text" formControlName="email_or_username" autocomplete="username" />
            <mat-error *ngIf="form.controls.email_or_username.hasError('required')">Ingresa tu email o usuario.</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Contrasena</mat-label>
            <input matInput [type]="hidePassword() ? 'password' : 'text'" formControlName="password" autocomplete="current-password" />
            <button
              mat-icon-button
              matSuffix
              type="button"
              [attr.aria-label]="hidePassword() ? 'Mostrar contrasena' : 'Ocultar contrasena'"
              (click)="hidePassword.set(!hidePassword())"
            >
              <mat-icon>{{ hidePassword() ? 'visibility' : 'visibility_off' }}</mat-icon>
            </button>
            <mat-error *ngIf="form.controls.password.hasError('required')">Ingresa tu contrasena.</mat-error>
          </mat-form-field>

          <p class="form-error" *ngIf="errorMessage()">{{ errorMessage() }}</p>

          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || loading()">
            {{ loading() ? 'Ingresando...' : 'Ingresar' }}
          </button>
        </form>
      </section>
    </main>
  `,
  styles: [
    `
      .login-page {
        min-height: 100dvh;
        display: grid;
        place-items: center;
        padding: var(--space-6);
      }

      .login-panel {
        width: min(100%, 440px);
        display: grid;
        gap: var(--space-6);
        padding: var(--space-8);
      }

      .login-copy {
        display: grid;
        gap: var(--space-3);
      }

      .eyebrow {
        color: var(--color-accent);
        font-weight: 700;
        text-transform: uppercase;
        font-size: var(--text-xs);
      }

      .login-copy p {
        margin: 0;
        color: var(--ct-muted);
      }

      .login-form {
        display: grid;
        gap: var(--space-4);
      }

      .form-error {
        margin: 0;
        color: var(--color-error);
        font-weight: 600;
      }

      button[type='submit'] {
        min-height: 44px;
      }

      @media (max-width: 520px) {
        .login-page {
          padding: var(--space-4);
          place-items: stretch;
        }

        .login-panel {
          align-self: center;
          padding: var(--space-6);
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly loading = signal(false);
  protected readonly hidePassword = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly form = this.fb.nonNullable.group({
    email_or_username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor() {
    if (this.auth.isAuthenticated()) {
      this.router.navigateByUrl(this.getReturnUrl());
    }
  }

  protected submit(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.auth
      .login(this.form.getRawValue())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => this.router.navigateByUrl(this.getReturnUrl()),
        error: (error: unknown) => this.errorMessage.set(mapApiErrorMessage(error, 'No fue posible iniciar sesion.'))
      });
  }

  private getReturnUrl(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    return returnUrl && returnUrl.startsWith('/') ? returnUrl : '/dashboard';
  }
}
