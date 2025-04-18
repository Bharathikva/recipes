import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private loginModalSubject = new Subject<void>();
  loginModal$ = this.loginModalSubject.asObservable();

  openLoginModal() {
    this.loginModalSubject.next();
  }
}
