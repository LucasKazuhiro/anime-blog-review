import { Component } from '@angular/core';
import { AnimeService } from '../services/anime.service';
import { Review } from '../models/review.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LinkMenuComponent } from '../link-menu/link-menu.component';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, LinkMenuComponent],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent {
  public reviewsBanner:Review[] = []

  constructor(private router: Router, private animeService: AnimeService) {
    this.animeService.reviewsBanner$.subscribe(reviewsBanner => {
      this.reviewsBanner = reviewsBanner;
    })
  }

  navigateTo(animeId: String): void{
    this.router.navigate([`/review/${animeId}`]);
  }
}