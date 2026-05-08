import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { appRoutes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { customersFeatureKey, customersReducer } from './features/customers/store/customers.reducer';
import { CustomersEffects } from './features/customers/store/customers.effects';
import { productsFeatureKey, productsReducer } from './features/products/store/products.reducer';
import { ProductsEffects } from './features/products/store/products.effects';
import { ingredientsFeatureKey, ingredientsReducer } from './features/ingredients/store/ingredients.reducer';
import { IngredientsEffects } from './features/ingredients/store/ingredients.effects';
import { recipesFeatureKey, recipesReducer } from './features/recipes/store/recipes.reducer';
import { RecipesEffects } from './features/recipes/store/recipes.effects';
import { ordersFeatureKey, ordersReducer } from './features/orders/store/orders.reducer';
import { OrdersEffects } from './features/orders/store/orders.effects';
import { paymentsFeatureKey, paymentsReducer } from './features/payments/store/payments.reducer';
import { PaymentsEffects } from './features/payments/store/payments.effects';
import { uiReducer } from './store/ui.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor])),
    provideStore({
      ui: uiReducer,
      [customersFeatureKey]: customersReducer,
      [productsFeatureKey]: productsReducer,
      [ingredientsFeatureKey]: ingredientsReducer,
      [recipesFeatureKey]: recipesReducer,
      [ordersFeatureKey]: ordersReducer,
      [paymentsFeatureKey]: paymentsReducer
    }),
    provideEffects(
      CustomersEffects,
      ProductsEffects,
      IngredientsEffects,
      RecipesEffects,
      OrdersEffects,
      PaymentsEffects
    ),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode()
    }),
    importProvidersFrom(MatSnackBarModule, MatDialogModule)
  ]
};
