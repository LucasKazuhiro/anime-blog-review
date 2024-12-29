import { Component, OnInit } from '@angular/core';
import { LinkMenuComponent } from '../link-menu/link-menu.component';
import { MarkdownService } from 'ngx-markdown';
import { ActivatedRoute } from '@angular/router';
import { AnimeService } from '../services/anime.service';
import { Review } from '../models/review.model';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { last, lastValueFrom } from 'rxjs';

@Component({
  selector: 'review',
  imports: [LinkMenuComponent, CommonModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent implements OnInit {

  public reviewText: string | null = null;
  public reviewInfo: Review | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private animeService: AnimeService, private mdService: MarkdownService) { }

  async ngOnInit() {
    const reviewId = this.route.snapshot.paramMap.get('id');

    if (reviewId) {
      try {
        // Get the text from the markdown file
        const reviewText = await lastValueFrom(this.http.get('/reviews_md/' + reviewId + '.md', { responseType: 'text' }));
        // Parse the content into HTML (sanitizing if needed)
        this.reviewText = await this.mdService.parse(reviewText);
      }
      catch (error) {
        console.log("Error loading or parsing review text: ", error);
      }

      // Saves the searched review
      this.animeService.getReview(reviewId);

      // Get the saved review to display its data on the website
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
