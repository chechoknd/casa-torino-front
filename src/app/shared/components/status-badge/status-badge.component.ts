import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ct-status-badge',
  standalone: true,
  template: `<span class="status-chip" [style.background]="background" [style.color]="color">{{ label }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusBadgeComponent {
  @Input({ required: true }) label = '';
  @Input() tone: 'success' | 'warning' | 'danger' | 'info' | 'muted' = 'muted';

  get background(): string {
    return {
      success: '#dcefd2',
      warning: '#f5dfb8',
      danger: '#f4d7d1',
      info: '#d8e8ef',
      muted: '#ebe2d4'
    }[this.tone];
  }

  get color(): string {
    return {
      success: '#244a17',
      warning: '#6f4b0f',
      danger: '#79251f',
      info: '#1f4c61',
      muted: '#5d5548'
    }[this.tone];
  }
}
