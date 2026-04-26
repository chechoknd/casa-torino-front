import { Routes } from '@angular/router';
import { RecipeDetailComponent } from './components/recipe-detail/recipe-detail.component';
import { RecipeFormComponent } from './components/recipe-form/recipe-form.component';
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';

export const RECIPES_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: '', component: RecipeListComponent },
      { path: 'new', component: RecipeFormComponent },
      { path: ':productId', component: RecipeDetailComponent }
    ]
  }
];
