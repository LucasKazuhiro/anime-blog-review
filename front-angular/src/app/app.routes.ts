import { Routes } from '@angular/router';
import { ReviewsComponent } from './reviews/reviews.component';
import { ReviewComponent } from './review/review.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { MusicsComponent } from './musics/musics.component';

export const routes: Routes = [
  { path: '', component: ReviewsComponent },
  { path: 'reviews', component: ReviewsComponent },
  { path: 'review/:id', component: ReviewComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'musics', component: MusicsComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
