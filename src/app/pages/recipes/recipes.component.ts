import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from "../../components/loading/loading.component";
import { MealCardComponent } from "../../components/meal-card/meal-card.component";
import { PageTitleComponent } from '../../shared/page-title/page-title.component';
import { trigger, transition, query, style, stagger, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-recipes',
  imports: [CommonModule, RouterModule, FormsModule, LoadingComponent, MealCardComponent,PageTitleComponent],
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
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
export class RecipesComponent implements OnInit {
  meals: any[] = [];
  categories: any[] = [];
  selectedCategory: string | null = null;
  searchQuery: string = '';
  loading: boolean = true;
  apptDashboard: any[]=[];

  @ViewChild('carouselContainer') carouselContainer!: ElementRef;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.fetchAllMeals();
    this.loadCategories();
  }

  fetchAllMeals() {
    this.loading = true;
    this.recipeService.searchMealsByName('a').subscribe((data: any) => {
      this.meals = data.meals || [];
      this.loading = false;
    });
  }

  loadCategories() {
    this.recipeService.listCategories().subscribe((data: any) => {
      this.categories = data.categories;
    });
  }

  onCategorySelect(category: string) {
    this.selectedCategory = category;
    this.searchQuery = '';
    this.loading = true;

    this.recipeService.getMealsByCategory(category).subscribe((data: any) => {
      this.meals = data.meals || [];
      this.loading = false;
    });
  }

  clearFilters() {
    this.selectedCategory = null;
    this.searchQuery = '';
    this.fetchAllMeals();
  }

  onSearch() {
    if (this.searchQuery.trim() !== '') {
      this.selectedCategory = null;
      this.loading = true;
      this.recipeService.searchMealsByName(this.searchQuery).subscribe((data: any) => {
        this.meals = data.meals || [];
        this.loading = false;
      });
    } else {
      this.fetchAllMeals();
    }
  }

  scrollLeft(): void {
    this.carouselContainer.nativeElement.scrollLeft -= this.carouselContainer.nativeElement.offsetWidth * 0.8;
  }

  scrollRight(): void {
    this.carouselContainer.nativeElement.scrollLeft += this.carouselContainer.nativeElement.offsetWidth * 0.8;
  }
}
