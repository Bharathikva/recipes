import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RecipeService } from '../../services/recipe.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import Swal from 'sweetalert2';
import { FavoritesAnimationService } from '../../services/favorites-animation.service';


@Component({
  selector: 'app-meal-card',
  templateUrl: './meal-card.component.html',
  styleUrls: ['./meal-card.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class MealCardComponent implements OnInit {
  @Input() meal: any;
  @Input() showCategory: boolean = false;

  savedMealIds: string[] = [];

  constructor(
    private authService: AuthService,
    private recipeService: RecipeService,
    private modalService: ModalService,
    private animService: FavoritesAnimationService 
  ) {}

  ngOnInit() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.recipeService.getSavedMeals(userId).subscribe((res: any) => {
        this.savedMealIds = res.mealIds || [];
      });
    }
  }

  isMealSaved(mealId: string): boolean {
    return this.savedMealIds.includes(mealId);
  }

  toggleSave(mealId: string, event: MouseEvent) {
    const userId = this.authService.getUserId();
  
    if (!userId) {
      this.modalService.openLoginModal();
      return;
    }
  
    if (!this.isMealSaved(mealId)) {
      this.recipeService.saveMealForUser(userId, mealId).subscribe(() => {
        this.savedMealIds.push(mealId);
        this.flyToFavorites(event); 
        this.animService.trigger();
      });
    } else {
      this.recipeService.unsaveMeal(userId, mealId).subscribe(() => {
        this.savedMealIds = this.savedMealIds.filter(id => id !== mealId);
      });
    }
  }
  
  
  flyToFavorites(event: MouseEvent) {
    const target = document.getElementById('favorites-target');
    if (!target) return;
  
    const icon = document.createElement('div');
    icon.innerHTML = `<img src="${this.meal.strMealThumb}" style="width:40px;height:40px;border-radius:50%;" />`;
    icon.style.position = 'fixed';
    icon.style.zIndex = '9999';
    icon.style.pointerEvents = 'none';
    icon.style.transition = 'transform 0.6s ease-in-out';
    icon.style.filter = 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))';
  
    const startX = event.clientX;
    const startY = event.clientY;
  
    const rect = target.getBoundingClientRect();
    const endX = rect.left + rect.width / 2;
    const endY = rect.top + rect.height / 2;
  
    icon.style.left = `${startX}px`;
    icon.style.top = `${startY}px`;
  
    document.body.appendChild(icon);
  
    const deltaX = endX - startX;
    const deltaY = endY - startY;
  
    const animation = icon.animate(
      [
        {
          transform: `translate(0, 0) scale(1) rotate(0deg)`,
          opacity: 1,
        },
        {
          transform: `translate(${deltaX * 0.3}px, ${deltaY * 0.5}px) scale(1.3) rotate(180deg)`,
          opacity: 0.9,
          offset: 0.6,
        },
        {
          transform: `translate(${deltaX}px, ${deltaY}px) scale(0.3) rotate(360deg)`,
          opacity: 0,
        }
      ],
      {
        duration: 700,
        easing: 'ease-in-out'
      }
    );
  
    animation.onfinish = () => icon.remove();
  }
  
  
  
}
