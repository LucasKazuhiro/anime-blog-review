import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AnimeService } from '../services/anime.service';
import { Review } from '../models/review.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LinkMenuComponent } from '../link-menu/link-menu.component';
import { FormsModule } from '@angular/forms';
import Fuse from 'fuse.js'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchBoxComponent } from "../ui/search-box/search-box.component";
import { InfiniteScrollDirective } from "ngx-infinite-scroll";

@Component({
  selector: 'app-reviews',
  imports: [CommonModule, FormsModule, LinkMenuComponent, SearchBoxComponent, InfiniteScrollDirective],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent implements OnInit {
  // Injects DestroyRef to automatically handle (destroy) subscriptions
  destroyRef = inject(DestroyRef);

  // Load reviews on scroll
  currentPage: number = 1;
  itemsPerPage: number = 4;

  // Fuse.js
  private fuseOptions = {
    // minMatchCharLength: 1,
    threshold: 0.7,
    keys: [
      "name"
    ]
  };
  private fuse: Fuse<Review> = new Fuse([], this.fuseOptions);

  // Reviews arrays
  public allReviews: Review[] = [];
  public displayReviews: Review[] = [];

  // Chenge between "Loading content..." or "No results found..."
  public searchValue: string = "";

  // Display the loading circle when loading NEW reviews
  public isNewReviewsLoading: boolean = false;

  constructor(private router: Router, private animeService: AnimeService) { }

  ngOnInit() {
    // Concatenate the displayReviews (old) with the new reviews
    this.animeService.loadReviewsOnScroll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (newReviews) => {
        this.displayReviews = [...this.displayReviews, ...newReviews];
        this.isNewReviewsLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isNewReviewsLoading = false;
      }
    });

    // Get all reviews for search
    this.animeService.reviewsBanner$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(reviews => {
      if (reviews) {
        this.allReviews = reviews;
        this.fuse.setCollection(this.allReviews); // Updates the Fuse data (to use on search)
      }
    })

    // Get searched value
    this.animeService.searchReview$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(searchedReview => {
      this.handleSearch(searchedReview);
    })
  }

  // Increases the number of the current page (loading more data)
  loadMoreReviews() {
    this.isNewReviewsLoading = true;
    this.currentPage += 1;
    this.animeService.updateCurrentPage(this.currentPage);
  }

  // Search the anime name
  private handleSearch(searchedReview: string) {
    // Save the searched value (to define if "Loading content..." or "No results found..." will show)
    this.searchValue = searchedReview;

    // If there is something being searched...
    if (searchedReview != "") {
      // Return all possible matches
      this.displayReviews = this.fuse.search(searchedReview).map(result => result.item);
    }
    // If the search box is empty...
    else {
      this.displayReviews = [] // Clean display array (remove searched reviews)
      this.currentPage = 0; // Resets the current page
      this.loadMoreReviews(); // Load the first reviews again
    }
  }

  // Navigate to review page and send the animeId
  public navigateTo(reviewId: String): void {
    this.router.navigate([`/review/${reviewId}`]);
  }
}