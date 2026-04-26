import { Routes } from '@angular/router';
import { PaymentFormComponent } from './components/payment-form/payment-form.component';
import { PaymentListComponent } from './components/payment-list/payment-list.component';

export const PAYMENTS_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: '', component: PaymentListComponent },
      { path: 'new', component: PaymentFormComponent }
    ]
  }
];
