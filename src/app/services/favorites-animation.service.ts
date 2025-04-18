// favorites-animation.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FavoritesAnimationService {
  private triggerSubject = new Subject<void>();
  trigger$ = this.triggerSubject.asObservable();

  trigger() {
    this.triggerSubject.next();
  }
}
