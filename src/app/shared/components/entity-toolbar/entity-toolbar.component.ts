import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ct-entity-toolbar',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="page-header">
      <div class="toolbar-copy">
        <h1>{{ title }}</h1>
        <p>{{ subtitle }}</p>
      </div>
      <button
        mat-flat-button
        color="primary"
        type="button"
        class="toolbar-action-button"
        (click)="create.emit()"
      >
        <mat-icon>add</mat-icon>
        {{ actionLabel }}
      </button>
      <button
        mat-icon-button
        type="button"
        class="toolbar-add-button"
        [attr.aria-label]="actionLabel"
        (click)="create.emit()"
      >
        <mat-icon>add</mat-icon>
      </button>
    </div>
  `,
  styles: [
    `
      h1 {
        margin: 0 0 0.25rem;
      }

      p {
        margin: 0;
        color: var(--ct-muted);
      }

      .toolbar-copy {
        min-width: 0;
      }

      .toolbar-add-button {
        flex: 0 0 auto;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntityToolbarComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) subtitle = '';
  @Input() actionLabel = 'Nuevo';
  @Output() create = new EventEmitter<void>();
}
