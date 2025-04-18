import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { trigger, transition, style, animate } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { slideInAnimation } from './app.animation';
import { FavoritesComponent } from "./components/favorites/favorites.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, FavoritesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  // animations:[slideInAnimation],
})
export class AppComponent {
  title = 'tamil_samayal';
  
}
