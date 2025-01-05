import { AfterViewChecked, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AnimeService } from '../services/anime.service';
import { Review } from '../models/review.model';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'review-info',
  imports: [CommonModule],
  templateUrl: './review-info.component.html',
  styleUrl: './review-info.component.css'
})
export class ReviewInfoComponent implements OnInit, AfterViewChecked {
  // Injects DestroyRef to automatically handle (destroy) subscriptions
  destroyRef = inject(DestroyRef);

  // Store the review to be displayed
  public reviewInfo: Review = new Review;

  // Map with genres key, genres name and url
  public genresMap: { [key: string]: { name: string; url: string } } = {
    action: { name: "Action", url: "https://myanimelist.net/anime/genre/1/Action" },
    adventure: { name: "Adventure", url: "https://myanimelist.net/anime/genre/2/Adventure" },
    avantGarde: { name: "Avant-Garde", url: "https://myanimelist.net/anime/genre/5/Avant_Garde" },
    awardWinning: { name: "Award Winning", url: "https://myanimelist.net/anime/genre/46/Award_Winning" },
    boysLove: { name: "Boys Love", url: "https://myanimelist.net/anime/genre/28/Boys_Love" },
    comedy: { name: "Comedy", url: "https://myanimelist.net/anime/genre/4/Comedy" },
    drama: { name: "Drama", url: "https://myanimelist.net/anime/genre/8/Drama" },
    fantasy: { name: "Fantasy", url: "https://myanimelist.net/anime/genre/10/Fantasy" },
    girlsLove: { name: "Girls Love", url: "https://myanimelist.net/anime/genre/26/Girls_Love" },
    gourmet: { name: "Gourmet", url: "https://myanimelist.net/anime/genre/47/Gourmet" },
    horror: { name: "Horror", url: "https://myanimelist.net/anime/genre/14/Horror" },
    mystery: { name: "Mystery", url: "https://myanimelist.net/anime/genre/7/Mystery" },
    romance: { name: "Romance", url: "https://myanimelist.net/anime/genre/22/Romance" },
    sciFi: { name: "Sci-Fi", url: "https://myanimelist.net/anime/genre/24/Sci-Fi" },
    slifeOfLife: { name: "Slife of Life", url: "https://myanimelist.net/anime/genre/36/Slice_of_Life" },
    sports: { name: "Sports", url: "https://myanimelist.net/anime/genre/30/Sports" },
    supernatural: { name: "Supernatural", url: "https://myanimelist.net/anime/genre/37/Supernatural" },
    suspense: { name: "Suspense", url: "https://myanimelist.net/anime/genre/41/Suspense" },
  };

  // Variable to trigger all genres (for test purposes)
  // allGenres = Object.keys(this.genresMap);

  constructor(private animeService: AnimeService) { }

  ngOnInit() {
    // Get the saved review to display its data on the website
    this.animeService.reviewSelected$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(reviewInfo => {
      if (reviewInfo && reviewInfo.id != '') {
        this.reviewInfo = reviewInfo;
      }
      else {
        this.reviewInfo = new Review;
      }

      console.log("aa" + reviewInfo)
    })
  }

  ngAfterViewChecked() {
    // Executes function to add little delays
    this.startAnimation(0.5, this.reviewInfo.rate, "star_");
    this.startAnimation(0.6, this.reviewInfo.genres.length, "genre_");
    this.startAnimation(0.8, 3, "links-img_");
  }

  // Function to create a little delay between elements (for animation purposes)
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
}
