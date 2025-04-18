import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../services/recipe.service';
import { LoadingComponent } from "../../components/loading/loading.component";
import { MealCardComponent } from '../../components/meal-card/meal-card.component';
import { PageTitleComponent } from '../../shared/page-title/page-title.component';
import { trigger, transition, query, style, stagger, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-category-recipes',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent,MealCardComponent,PageTitleComponent],
  templateUrl: './category-recipes.component.html',
  styleUrls: ['./category-recipes.component.css'],
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
export class CategoryRecipesComponent implements OnInit {
  meals: any[] = [];
  categoryName: string = '';
  loading: boolean = true;
  apptDashboard: any[]=[];


  constructor(private route: ActivatedRoute, private recipeService: RecipeService) {}

  ngOnInit(): void {
    // Scroll to the top when this component is initialized
    window.scrollTo(0, 0);

    // Fetch the category and meals data
    this.route.paramMap.subscribe(params => {
      const cat = params.get('name');
      if (cat) {
        this.categoryName = cat;
        this.recipeService.getMealsByCategory(cat).subscribe((res: any) => {
          this.meals = res.meals;
          this.loading = false;
        });
      }
    });
  }
}
