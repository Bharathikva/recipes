import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CategoryRecipesComponent } from './pages/category-recipes/category-recipes.component';
import { MealDetailsComponent } from './pages/meal-details/meal-details.component';
import { RecipesComponent } from './pages/recipes/recipes.component';
import { CountryComponent } from './pages/country/country.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FavoritesPageComponent } from './pages/favorites-page/favorites-page.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'category/:name', component: CategoryRecipesComponent },
  { path: 'meal/:id', component: MealDetailsComponent },
  { path: 'recipes', component: RecipesComponent },
  { path: 'country', component: CountryComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'favorites', component: FavoritesPageComponent },

];
