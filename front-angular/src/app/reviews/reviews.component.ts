import { AfterViewInit, Component, HostListener } from '@angular/core';
import { AnimeService } from '../services/anime.service';
import { Review } from '../models/review.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LinkMenuComponent } from '../link-menu/link-menu.component';
import { FormsModule } from '@angular/forms';
import Fuse from 'fuse.js'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-reviews',
  imports: [CommonModule, FormsModule, LinkMenuComponent],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent implements AfterViewInit {

  // Variable to change magnifier SVG fill color
  isSearchFocused = false;

  // Fuse.js
  fuse!: Fuse<Review>;
  fuseOptions = {
    // minMatchCharLength: 1,
    threshold: 0.7,
    keys: [
      "name"
    ]
  };

  // Search & Reviews
  searchValue: string = "";
  allReviews: Review[] = [];
  displayReviews: Review[] | null = null;

  // Debounce search (cooldown)
  searchValueUpdate = new Subject<string>();

  constructor(private router: Router, private animeService: AnimeService) {
    // Get all reviews
    this.animeService.reviewsBanner$.pipe(takeUntilDestroyed()).subscribe(reviews => {
      if (reviews) {
        this.allReviews = reviews;
        this.fuse = new Fuse(this.allReviews, this.fuseOptions); // Create Fuse instance
        this.displayReviews = this.allReviews; // Display all the reviews
      }
    })

    // Debounce search (cooldown)
    this.searchValueUpdate.pipe(debounceTime(500)).subscribe(() => {
      this.handleSearch();
    })
  }

  ngAfterViewInit() {
    this.startAnimation(0.05, 17, "loading_");
  }

  // Search the anime name
  handleSearch() {
    if (this.searchValue) {
      // Return all possible matches
      this.displayReviews = this.fuse.search(this.searchValue).map(result => result.item);
      console.log(this.displayReviews)
    }
    else {
      // If input is empty, return all reviews
      this.displayReviews = this.allReviews;
    }
  }

  // Clean search box
  cleanSearchBox() {
    this.searchValue = '';
    this.searchValueUpdate.next('');
    this.focusSearchBox();
  }

  focusSearchBox() {
    const searchBox = document.getElementById('search-box');
    if (searchBox) searchBox.focus();
  }

  // Search box shortcuts
  @HostListener('window:keydown', ['$event'])
  handleSearchBoxShortcut(event: KeyboardEvent) {
    const searchBox = document.getElementById('search-box')

    if (searchBox) {
      // Ctrl + K
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault(); // Prevent default browser action
        searchBox.focus();
      }

      // Esc
      else if (event.key === 'Escape') {
        searchBox.blur();
      }
    }
  }

  // Fuction to animate several items with some delay between each of them
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

  // Navigate to review page and send the animeId
  navigateTo(reviewId: String): void {
    this.router.navigate([`/review/${reviewId}`]);
  }
}