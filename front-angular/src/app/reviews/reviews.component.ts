import { Component } from '@angular/core';
import { AnimeService } from '../services/anime.service';
import { Review } from '../models/review.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LinkMenuComponent } from '../link-menu/link-menu.component';

@Component({
    selector: 'app-reviews',
    imports: [CommonModule, LinkMenuComponent],
    templateUrl: './reviews.component.html',
    styleUrl: './reviews.component.css'
})
export class ReviewsComponent {
  public reviewsBanner: Review[] = [];
  public reviewsBannerDisplay: Review[] = [];
  public startLimitReviewsBanner = 3;
  public addMoreReviewsBanner = 5;

  constructor(private router: Router, private animeService: AnimeService) {
    // Get the array of all animes reviews info
    this.animeService.reviewsBanner$.subscribe(reviewsBanner => {
      this.reviewsBanner = reviewsBanner;

      // Load just some animes reviews info
      this.reviewsBannerDisplay = this.reviewsBanner.length >= this.startLimitReviewsBanner ? this.reviewsBanner.slice(0, this.startLimitReviewsBanner) : this.reviewsBanner;
    })
  }

  navigateTo(animeId: String): void {
    // Navigate to review page and send the animeId
    this.router.navigate([`/review/${animeId}`]);
  }

  showMore() {
    // Increases de number of itens to show
    let newLenght = this.reviewsBannerDisplay.length + this.addMoreReviewsBanner;
    if (newLenght > this.reviewsBanner.length) {
      newLenght = this.reviewsBanner.length;
    }
    // Insert the new itens into the display array
    this.reviewsBannerDisplay = this.reviewsBanner.slice(0, newLenght);
  }
}