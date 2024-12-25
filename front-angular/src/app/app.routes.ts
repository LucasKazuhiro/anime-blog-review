import { Routes } from '@angular/router';
import { ReviewsComponent } from './reviews/reviews.component';

export const routes: Routes = [
  { path: '', component: ReviewsComponent },
  { path: 'reviews', component: ReviewsComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
