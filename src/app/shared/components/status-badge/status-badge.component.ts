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
      success: '#d6f2d0',
      warning: '#fde7b5',
      danger: '#f7d4d0',
      info: '#d7ecff',
      muted: '#eadfce'
    }[this.tone];
  }

  get color(): string {
    return {
      success: '#224e1d',
      warning: '#6d4e00',
      danger: '#7d2119',
      info: '#104a78',
      muted: '#5d4737'
    }[this.tone];
  }
}

