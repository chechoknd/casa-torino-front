import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { selectUiLoading } from '../../../store/ui.selectors';

@Component({
  selector: 'ct-loading-spinner',
  standalone: true,
  imports: [NgIf, AsyncPipe, MatProgressSpinnerModule],
  template: `
    <div *ngIf="loading$ | async" class="spinner-backdrop">
      <mat-spinner diameter="52"></mat-spinner>
    </div>
  `,
  styles: [
    `
      .spinner-backdrop {
        position: fixed;
        inset: 0;
        display: grid;
        place-items: center;
        background: rgba(46, 34, 24, 0.22);
        backdrop-filter: blur(2px);
        z-index: 1000;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingSpinnerComponent {
  private readonly store = inject(Store);
  protected readonly loading$ = this.store.select(selectUiLoading);
}

