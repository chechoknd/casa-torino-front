import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { ShellComponent } from './shared/components/shell/shell.component';

@Component({
  selector: 'ct-root',
  standalone: true,
  imports: [RouterOutlet, LoadingSpinnerComponent, ShellComponent],
  template: `
    <ct-shell>
      <router-outlet />
    </ct-shell>
    <ct-loading-spinner />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
