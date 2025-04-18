import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../services/recipe.service';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from "../../components/loading/loading.component";

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  loading: boolean = true;

  @ViewChild('carouselContainer') carouselContainer!: ElementRef;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService.listCategories().subscribe((res: any) => {
      this.categories = res.categories;
      this.loading = false;
    });
  }

  scrollLeft(): void {
    this.carouselContainer.nativeElement.scrollLeft -= this.carouselContainer.nativeElement.offsetWidth * 0.8; // Adjust scroll amount as needed
  }

  scrollRight(): void {
    this.carouselContainer.nativeElement.scrollLeft += this.carouselContainer.nativeElement.offsetWidth * 0.8; // Adjust scroll amount as needed
  }
}