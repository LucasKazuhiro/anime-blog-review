import { Component } from '@angular/core';
import { LinkMenuComponent } from '../link-menu/link-menu.component';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'review',
  standalone: true,
  imports: [LinkMenuComponent],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent {

}
