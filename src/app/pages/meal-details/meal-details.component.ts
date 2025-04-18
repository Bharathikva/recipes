import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../services/recipe.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { trigger, transition, query, style, stagger, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-meal-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meal-details.component.html',
  styleUrls: ['./meal-details.component.css'],
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
export class MealDetailsComponent implements OnInit {
  meal: any;
  videoUrl?: SafeResourceUrl;
  apptDashboard: any[]=[];


  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.recipeService.getMealById(id).subscribe((res: any) => {
        this.meal = res.meals[0];
        if (this.meal.strYoutube) {
          const embedUrl = this.meal.strYoutube.replace('watch?v=', 'embed/');
          this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
        }
      });
    }
  }

  getIngredients(): string[] {
    if (!this.meal) return [];
    const ingredients: string[] = [];
    for (let i = 1; i <= 20; i++) {
      const ing = this.meal[`strIngredient${i}`];
      const measure = this.meal[`strMeasure${i}`];
      if (ing && ing.trim()) {
        ingredients.push(`${ing} - ${measure}`);
      }
    }
    return ingredients;
  }

  getIngredientsWithImages() {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = this.meal?.[`strIngredient${i}`];
      const measure = this.meal?.[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          name: `${ingredient} - ${measure}`,
          image: `https://www.themealdb.com/images/ingredients/${ingredient}.png`
        });
      }
    }
    return ingredients;
  }
  
}
