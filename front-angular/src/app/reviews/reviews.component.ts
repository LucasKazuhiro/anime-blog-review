import { AfterViewInit, Component } from '@angular/core';
import { AnimeService } from '../services/anime.service';
import { Review } from '../models/review.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LinkMenuComponent } from '../link-menu/link-menu.component';
import { FormsModule } from '@angular/forms';
import Fuse from 'fuse.js'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchBoxComponent } from "../ui/search-box/search-box.component";

@Component({
  selector: 'app-reviews',
  imports: [CommonModule, FormsModule, LinkMenuComponent, SearchBoxComponent],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent implements AfterViewInit {

  // Fuse.js
  private fuse!: Fuse<Review>;
  private fuseOptions = {
    // minMatchCharLength: 1,
    threshold: 0.7,
    keys: [
      "name"
    ]
  };

  // Reviews arrays
  public allReviews: Review[] = [];
  public displayReviews: Review[] | null = null;

  constructor(private router: Router, private animeService: AnimeService) {
    // Creste Fuse instance
    this.fuse = new Fuse([], this.fuseOptions);

    // Get all reviews
    this.animeService.reviewsBanner$.pipe(takeUntilDestroyed()).subscribe(reviews => {
      if (reviews) {
        this.allReviews = reviews;
        this.fuse.setCollection(this.allReviews); // Updates the Fuse data (to use on search)
        this.displayReviews = this.allReviews; // Display all the reviews
      }
    })

    // Get searched value
    this.animeService.searchReview$.subscribe(searchedReview => {
      this.handleSearch(searchedReview);
    })
  }

  public ngAfterViewInit() {
    this.startAnimation(0.05, 17, "loading_");
  }

  // Search the anime name
  private handleSearch(searchedReview: string) {
    if (searchedReview) {
      // Return all possible matches
      this.displayReviews = this.fuse.search(searchedReview).map(result => result.item);
    }
    else {
      // If input is empty, return all reviews
      this.displayReviews = this.allReviews;
    }
  }

  // Fuction to animate several items with some delay between each of them
  private startAnimation(delayIncrease: number, loopLimit: number, idPrefix: string) {
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

  // Navigate to review page and send the animeId
  public navigateTo(reviewId: String): void {
    this.router.navigate([`/review/${reviewId}`]);
  }
}