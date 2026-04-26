import { Routes } from '@angular/router';
import { CustomerDetailComponent } from './components/customer-detail/customer-detail.component';
import { CustomerFormComponent } from './components/customer-form/customer-form.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';

export const CUSTOMERS_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: '', component: CustomerListComponent },
      { path: 'new', component: CustomerFormComponent },
      { path: 'edit/:id', component: CustomerFormComponent },
      { path: ':id', component: CustomerDetailComponent }
    ]
  }
];
