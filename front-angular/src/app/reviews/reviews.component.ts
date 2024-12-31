import { AfterViewInit, Component } from '@angular/core';
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
export class ReviewsComponent implements AfterViewInit {
  reviewsBanner$: Observable<Review[] | null>;
  reviewsTotalCount$: Observable<number>;

  public LimitReviewsBanner = 3;
  public addMoreReviewsBanner = 5;

  constructor(private router: Router, private animeService: AnimeService) {
    this.reviewsBanner$ = this.animeService.reviewsBanner$;
    this.reviewsTotalCount$ = this.reviewsBanner$.pipe(map(reviews => reviews?.length || 0));
  }

  ngAfterViewInit() {
    this.startAnimation(0.05, 17, "loading_");
  }

  startAnimation(delayIncrease: number, loopLimit: number, idPrefix: string) {
    let delay = 0;
    for (let i = 1; i <= loopLimit; i++) {
      // Calculates the delay value
      delay += delayIncrease;
      // Find a specific star element
      const element = document.getElementById(idPrefix + i)
      if (element) {
        // Defines the delay for the star animation
        element.style.animationDelay = delay.toString() + 's';
      }
    }
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