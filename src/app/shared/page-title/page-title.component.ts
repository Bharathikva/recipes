import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.css'] // or use inline styles
})
export class PageTitleComponent {
  @Input() title: string = '';
}
