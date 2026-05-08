import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'ct-root',
  standalone: true,
  imports: [RouterOutlet, LoadingSpinnerComponent],
  template: `
    <router-outlet />
    <ct-loading-spinner />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
