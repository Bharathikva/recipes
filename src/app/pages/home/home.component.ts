import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { LoadingComponent } from "../../components/loading/loading.component";
import { RouterModule } from '@angular/router';
import { CategoriesComponent } from "../categories/categories.component";
import {animate, keyframes, query, stagger, style, transition, trigger} from '@angular/animations';
import { MealCardComponent } from "../../components/meal-card/meal-card.component";
import { LandingComponent } from "../../components/landing/landing.component";

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, CategoriesComponent, MealCardComponent, LandingComponent],
  providers: [],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', style({opacity: 0}), {optional: true}),
        query(':enter', stagger('30ms', [
          animate('1s ease-in', keyframes([
            style({opacity: 0, transform: 'translateY(-75px)', offset: 0}),
            style({opacity: .5, transform: 'translateY(35px)', offset: 0.3}),
            style({opacity: 1, transform: 'translateY(0)', offset: 1}),
          ]))
        ]), {optional: true}),

        query(':leave', stagger('30ms', [
          animate('1s ease-in', keyframes([
            style({opacity: 1, transform: 'translateY(0)', offset: 0}),
            style({opacity: .5, transform: 'translateY(35px)', offset: 0.3}),
            style({opacity: 0, transform: 'translateY(-75px)', offset: 1}),
          ]))
        ]), {optional: true}),

      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  meals: any[] = [];
  searchQuery: string = ''; 
  searchSubject: Subject<string> = new Subject<string>(); // Subject to emit search query
  loading: boolean = true;
  specialMeals : any[] = [];
  apptDashboard: any[]=[];

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    // Call the API immediately with the default search query 'chicken'
    this.searchMeals(this.searchQuery);
    this.recipeService.searchMealsByName('chi').subscribe((data:any)=>{
      this.specialMeals = data.meals
    })
    // Set up the search query observable to debounce typing
    this.searchSubject.pipe(
      debounceTime(500), // Wait for 500ms after typing stops
      distinctUntilChanged(), // Only trigger when the search query changes
      switchMap((query: string) => this.recipeService.searchMealsByName(query)) // Make the API call when query changes
    ).subscribe(
      (data: any) => {
        // Handle successful response
        this.meals = data.meals;
        this.loading = false;
      },
      (error) => {
        // Handle error (if API fails)
        console.error('API request failed:', error);
        this.meals = [];
        this.loading = false;

      }
    );
  }

  // Function to call the search service with a query (called when user types)
  onSearch() {
    this.searchSubject.next(this.searchQuery); // Emit every time
  }
  

  // Function to trigger the meal search
  searchMeals(query: string) {
    this.recipeService.searchMealsByName(query).subscribe(
      (data: any) => {
        this.meals = data.meals; // Update meals with API response
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching meals:', error);
        this.meals = []; // Clear meals in case of an error
        this.loading = false;
      }
    );
  }
}
