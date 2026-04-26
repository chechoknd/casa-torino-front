import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotifierService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3500,
      panelClass: 'snackbar-success'
    });
  }

  error(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4500,
      panelClass: 'snackbar-error'
    });
  }
}

