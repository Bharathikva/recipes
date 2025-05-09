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
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(':enter', stagger('30ms', [
          animate('1s ease-in', keyframes([
            style({ opacity: 0, transform: 'translateY(-75px)', offset: 0 }),
            style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
          ]))
        ]), { optional: true }),

        query(':leave', stagger('30ms', [
          animate('1s ease-in', keyframes([
            style({ opacity: 1, transform: 'translateY(0)', offset: 0 }),
            style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
            style({ opacity: 0, transform: 'translateY(-75px)', offset: 1 }),
          ]))
        ]), { optional: true }),
      ])
    ])
  ]
})
export class MealDetailsComponent implements OnInit {
  meal: any;
  videoUrl?: SafeResourceUrl;
  apptDashboard: any[] = [];
  cookingQuotes = [
    "Cooking is an art, but all art requires knowing something about the techniques and materials",
    "The secret of good cooking is, first, having a love of it",
    "A recipe has no soul. You, as the cook, must bring soul to the recipe",
    "Cooking is like love. It should be entered into with abandon or not at all",
    "Good food is very often, even most often, simple food"
  ];

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private sanitizer: DomSanitizer
  ) { }

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

  getRandomQuote(): string {
    return this.cookingQuotes[Math.floor(Math.random() * this.cookingQuotes.length)];
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

  getInstructionsSteps() {
    if (!this.meal?.strInstructions) return [];
    // Split instructions into steps at each period or new line
    const steps = this.meal.strInstructions.split(/\. |\n/).filter((step: any) => step.trim().length > 0);
    return steps.map((step: any, index: any) => ({
      step: index + 1,
      text: step.trim() + (step.trim().endsWith('.') ? '' : '.')
    }));
  }

  getServings(): string {
    // This is a placeholder - you might need to parse from instructions or add a servings field
    return '4-6';
  }

  getNutritionInfo() {
    return [
      { label: 'Calories', value: '450 kcal' },
      { label: 'Carbs', value: '35g' },
      { label: 'Protein', value: '25g' },
      { label: 'Fat', value: '20g' }
    ];
  }

  getSimilarRecipes() {
    // Placeholder - in a real app you'd fetch similar recipes from your service
    return [
      { name: 'Spaghetti Carbonara', time: '25 mins', image: 'https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg' },
      { name: 'Beef Wellington', time: '1 hr 30 mins', image: 'https://www.themealdb.com/images/media/meals/vvpprx1487325699.jpg' },
      { name: 'Chicken Parmesan', time: '40 mins', image: 'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg' },
      { name: 'Vegetable Stir Fry', time: '20 mins', image: 'https://www.themealdb.com/images/media/meals/1525874812.jpg' }
    ];
  }
}