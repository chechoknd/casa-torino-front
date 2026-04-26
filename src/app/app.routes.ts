import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES)
  },
  {
    path: 'customers',
    loadChildren: () =>
      import('./features/customers/customers.routes').then((m) => m.CUSTOMERS_ROUTES)
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./features/products/products.routes').then((m) => m.PRODUCTS_ROUTES)
  },
  {
    path: 'ingredients',
    loadChildren: () =>
      import('./features/ingredients/ingredients.routes').then((m) => m.INGREDIENTS_ROUTES)
  },
  {
    path: 'recipes',
    loadChildren: () =>
      import('./features/recipes/recipes.routes').then((m) => m.RECIPES_ROUTES)
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('./features/orders/orders.routes').then((m) => m.ORDERS_ROUTES)
  },
  {
    path: 'payments',
    loadChildren: () =>
      import('./features/payments/payments.routes').then((m) => m.PAYMENTS_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
