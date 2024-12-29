import { Component, OnInit } from '@angular/core';
import { AnimeService } from '../services/anime.service';
import { Review } from '../models/review.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'review-info',
  imports: [CommonModule],
  templateUrl: './review-info.component.html',
  styleUrl: './review-info.component.css'
})
export class ReviewInfoComponent implements OnInit {

  public reviewInfo: Review = new Review;

  constructor(private animeService: AnimeService) { }

  ngOnInit() {
    // Get the saved review to display its data on the website
    this.animeService.reviewSelected$.subscribe(reviewInfo => {
      if (reviewInfo.id != '') {
        this.reviewInfo = reviewInfo;
      }
      else {
        this.reviewInfo = new Review;
      }
    })
  }
}
