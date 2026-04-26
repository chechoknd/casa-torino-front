import { AbstractControl, ValidationErrors } from '@angular/forms';

export function positiveNumberValidator(control: AbstractControl): ValidationErrors | null {
  const value = Number(control.value);
  return Number.isFinite(value) && value >= 0 ? null : { positiveNumber: true };
}

