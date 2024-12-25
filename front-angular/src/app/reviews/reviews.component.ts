import { Component } from '@angular/core';
import { AnimeService } from '../services/anime.service';
import { Review } from '../models/review.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent {
  public reviewsBanner:Review[] = []

  constructor(private animeService: AnimeService) {
    this.animeService.reviewsBanner$.subscribe(reviewsBanner => {
      this.reviewsBanner = reviewsBanner;
    })
  }

}