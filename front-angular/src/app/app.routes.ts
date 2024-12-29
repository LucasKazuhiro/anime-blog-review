import { Routes } from '@angular/router';
import { ReviewsComponent } from './reviews/reviews.component';
import { ReviewComponent } from './review/review.component';

export const routes: Routes = [
  { path: '', component: ReviewsComponent },
  { path: 'reviews', component: ReviewsComponent },
  { path: 'review/:id', component: ReviewComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
