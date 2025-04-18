import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from '../../components/loading/loading.component';
import { MealCardComponent } from "../../components/meal-card/meal-card.component";
import { trigger, transition, query, style, stagger, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-country',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoadingComponent, MealCardComponent],
  templateUrl: './country.component.html',
  styleUrl: './country.component.css',
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
export class CountryComponent implements OnInit {
  meals: any[] = [];
  areas: any[] = [];
  selectedArea: string | null = null;
  searchQuery: string = '';
  loading: boolean = true;
  alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  areaToCode: any
  selectedLetter: string | null = null; // add this line
  apptDashboard: any[]=[];


  @ViewChild('carouselContainer') carouselContainer!: ElementRef;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.fetchAllMeals();
    this.loadAreas();
    this.areaToCode = {
      American: 'us',
      British: 'gb',
      Canadian: 'ca',
      Chinese: 'cn',
      Croatian: 'hr',
      Dutch: 'nl',
      Egyptian: 'eg',
      French: 'fr',
      Greek: 'gr',
      Indian: 'in',
      Irish: 'ie',
      Italian: 'it',
      Jamaican: 'jm',
      Japanese: 'jp',
      Kenyan: 'ke',
      Malaysian: 'my',
      Mexican: 'mx',
      Moroccan: 'ma',
      Polish: 'pl',
      Portuguese: 'pt',
      Russian: 'ru',
      Spanish: 'es',
      Thai: 'th',
      Tunisian: 'tn',
      Turkish: 'tr',
      Vietnamese: 'vn',
      Filipino:'ph',
      Ukrainian:'ua',
      Uruguayan:'uy'
    };
  }

  fetchAllMeals() {
    this.loading = true;
    this.recipeService.searchMealsByName('a').subscribe((data: any) => {
      this.meals = data.meals || [];
      this.loading = false;
    });
  }

  loadAreas() {
    this.recipeService.listAreas().subscribe((data: any) => {
      this.areas = data.meals; // 'meals' here contains 'strArea'
    });
  }

  onAreaSelect(area: string) {
    this.selectedArea = area;
    this.searchQuery = '';
    this.loading = true;

    this.recipeService.getMealsByArea(area).subscribe((data: any) => {
      this.meals = data.meals || [];
      this.loading = false;
    });
  }

  clearFilters() {
    this.selectedArea = null;
    this.searchQuery = '';
    this.fetchAllMeals();
  }

  onSearch() {
    if (this.searchQuery.trim() !== '') {
      this.selectedArea = null;
      this.loading = true;
      this.recipeService
        .searchMealsByName(this.searchQuery)
        .subscribe((data: any) => {
          this.meals = data.meals || [];
          this.loading = false;
        });
    } else {
      this.fetchAllMeals();
    }
  }

  onAlphabetSelect(letter: string) {
    if (this.selectedLetter === letter) {
      // If same letter clicked again, reset
      this.selectedLetter = null;
      this.fetchAllMeals();
    } else {
      this.selectedLetter = letter;
      this.selectedArea = null;
      this.searchQuery = '';
      this.loading = true;
  
      this.recipeService.searchMealsByName(letter).subscribe((data: any) => {
        this.meals = data.meals || [];
        this.loading = false;
      });
    }
  }
  

  scrollLeft(): void {
    this.carouselContainer.nativeElement.scrollLeft -=
      this.carouselContainer.nativeElement.offsetWidth * 0.8;
  }

  scrollRight(): void {
    this.carouselContainer.nativeElement.scrollLeft +=
      this.carouselContainer.nativeElement.offsetWidth * 0.8;
  }


  
}
