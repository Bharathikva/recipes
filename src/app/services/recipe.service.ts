// recipe.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  baseUrl = 'https://www.themealdb.com/api/json/v1/1/';

  constructor(private http: HttpClient) {}

  searchMealsByName(name: string) {
    return this.http.get(`${this.baseUrl}search.php?s=${name}`);
  }

  getRandomMeal() {
    return this.http.get(`${this.baseUrl}random.php`);
  }

  getMealById(id: string) {
    return this.http.get(`${this.baseUrl}lookup.php?i=${id}`);
  }

  listCategories() {
    return this.http.get(`${this.baseUrl}categories.php`);
  }

  // Add these methods
  getMealsByCategory(category: string) {
    return this.http.get(`${this.baseUrl}filter.php?c=${category}`);
  }

  getAllCategories() {
    return this.http.get(`${this.baseUrl}list.php?c=list`);
  }

  listAreas() {
    return this.http.get(`${this.baseUrl}list.php?a=list`);
  }
  
  getMealsByArea(area: string) {
    return this.http.get(`${this.baseUrl}filter.php?a=${area}`);
  }

  signup(user: any) {
    return this.http.post('http://localhost:3000/api/auth/signup', user);
  }
  
  login(credentials: any) {
    return this.http.post('http://localhost:3000/api/auth/login', credentials);
  }
  
  // recipe.service.ts
saveMealForUser(userId: string, mealId: string) {
  return this.http.post(`http://localhost:3000/api/auth/user/${userId}/saved-meals`, {
    mealId: mealId
  });
}

getSavedMeals(userId: string) {
  return this.http.get<{ mealIds: string[] }>(`http://localhost:3000/api/auth/user/${userId}/saved-meals`);
}

unsaveMeal(userId: string, mealId: string){
  const url = `http://localhost:3000/api/auth/user/${userId}/saved-meals/${mealId}`;
  return this.http.delete(url);
}


  
}
