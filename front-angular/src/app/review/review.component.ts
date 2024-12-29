import { Component, OnInit } from '@angular/core';
import { MarkdownService } from 'ngx-markdown';
import { ActivatedRoute } from '@angular/router';
import { AnimeService } from '../services/anime.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ReviewInfoComponent } from '../review-info/review-info.component';

@Component({
  selector: 'review',
  imports: [CommonModule, ReviewInfoComponent],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent implements OnInit {

  public reviewText: string | null = null;

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
        this.reviewText = '';
        console.log("Error loading or parsing review text: ", error);
      }

      // Saves the searched review
      this.animeService.getReview(reviewId);
    }

  }
}
