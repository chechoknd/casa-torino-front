import { Routes } from '@angular/router';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductListComponent } from './components/product-list/product-list.component';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: '', component: ProductListComponent },
      { path: 'new', component: ProductFormComponent },
      { path: 'edit/:id', component: ProductFormComponent },
      { path: ':id', component: ProductDetailComponent }
    ]
  }
];
