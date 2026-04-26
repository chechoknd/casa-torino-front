import { Routes } from '@angular/router';
import { IngredientDetailComponent } from './components/ingredient-detail/ingredient-detail.component';
import { IngredientFormComponent } from './components/ingredient-form/ingredient-form.component';
import { IngredientListComponent } from './components/ingredient-list/ingredient-list.component';

export const INGREDIENTS_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: '', component: IngredientListComponent },
      { path: 'new', component: IngredientFormComponent },
      { path: 'edit/:id', component: IngredientFormComponent },
      { path: ':id', component: IngredientDetailComponent }
    ]
  }
];
