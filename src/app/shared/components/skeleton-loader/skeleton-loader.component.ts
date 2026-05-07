import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ct-skeleton-loader',
  standalone: true,
  imports: [NgFor],
  template: `
    <div class="skeleton-stack" [class.table]="variant === 'table'">
      <span
        class="skeleton-line"
        *ngFor="let row of rowsArray; let index = index"
        [style.width]="lineWidth(index)"
      ></span>
    </div>
  `,
  styles: [
    `
      .skeleton-stack {
        display: grid;
        gap: var(--space-3);
        width: 100%;
      }

      .skeleton-stack.table {
        padding: var(--space-5);
      }

      .skeleton-line {
        display: block;
        height: 16px;
        border-radius: 999px;
        background: linear-gradient(
          90deg,
          rgba(212, 201, 180, 0.46) 0%,
          rgba(255, 253, 248, 0.92) 42%,
          rgba(212, 201, 180, 0.46) 84%
        );
        background-size: 220% 100%;
        animation: skeleton-shimmer 1.25s ease-in-out infinite;
      }

      .table .skeleton-line {
        height: 34px;
        border-radius: var(--radius-sm);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonLoaderComponent {
  @Input() rows = 3;
  @Input() variant: 'lines' | 'table' = 'lines';

  protected get rowsArray(): number[] {
    return Array.from({ length: this.rows });
  }

  protected lineWidth(index: number): string {
    if (this.variant === 'table') {
      return '100%';
    }

    return index % 3 === 0 ? '78%' : index % 3 === 1 ? '92%' : '64%';
  }
}
