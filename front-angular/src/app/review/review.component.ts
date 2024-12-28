import { Component, OnInit } from '@angular/core';
import { LinkMenuComponent } from '../link-menu/link-menu.component';
import { MarkdownModule } from 'ngx-markdown';
import { ActivatedRoute } from '@angular/router';
import { AnimeService } from '../services/anime.service';
import { Review } from '../models/review.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'review',
  imports: [LinkMenuComponent, MarkdownModule, CommonModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent implements OnInit {

  public reviewId: string | null = null;
  public reviewInfo: Review | null = null;

  constructor(private route: ActivatedRoute, private animeService: AnimeService) { }

  ngOnInit() {
    const reviewId = this.route.snapshot.paramMap.get('id');

    if (reviewId) {
      this.reviewId = reviewId;
      this.animeService.getReview(this.reviewId);

      this.animeService.reviewSelected$.subscribe(reviewInfo => {
        if (reviewInfo.id != '') {
          this.reviewInfo = reviewInfo;
        }
        else {
          this.reviewInfo = null;
        }
      })
    }

  }
}
