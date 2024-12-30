import { Component } from '@angular/core';
import { AnimeService } from '../services/anime.service';
import { Review } from '../models/review.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LinkMenuComponent } from '../link-menu/link-menu.component';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-reviews',
  imports: [CommonModule, LinkMenuComponent],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent {
  reviewsBanner$: Observable<Review[]>;
  reviewsTotalCount$: Observable<number>;

  public LimitReviewsBanner = 3;
  public addMoreReviewsBanner = 5;

  constructor(private router: Router, private animeService: AnimeService) {
    this.reviewsBanner$ = this.animeService.reviewsBanner$;
    this.reviewsTotalCount$ = this.reviewsBanner$.pipe(map(reviews => reviews.length));
  }

  navigateTo(reviewId: String): void {
    // Navigate to review page and send the animeId
    this.router.navigate([`/review/${reviewId}`]);
  }

  showMore() {
    // // Increases de number of itens to show
    this.LimitReviewsBanner += this.addMoreReviewsBanner;
  }
}