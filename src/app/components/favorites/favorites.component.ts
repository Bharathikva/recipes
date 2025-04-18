// favorites.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FavoritesAnimationService } from '../../services/favorites-animation.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
})
export class FavoritesComponent implements OnInit, OnDestroy {
  isAnimating = false;
  private sub!: Subscription;

  constructor(private animService: FavoritesAnimationService, private router:Router) {}

  ngOnInit(): void {
    this.sub = this.animService.trigger$.subscribe(() =>
      this.triggerAnimation()
    );
  }

  triggerAnimation() {
    this.isAnimating = true;
    setTimeout(() => (this.isAnimating = false), 500);
  }

  onFavoritesClick(): void {
    this.router.navigate(['/favorites']);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
