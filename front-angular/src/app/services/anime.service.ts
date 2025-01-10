import { DestroyRef, inject, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, delay, map, Observable } from 'rxjs';
import { Review } from '../models/review.model';
import { HttpClient } from '@angular/common/http';
import { Favorite } from '../models/favorite.model';
import { Music } from '../models/music.model';
import { environment } from '../../environments/environment';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {
  // Backend domain link
  private backendDomain: string = environment.backendDomain;

  // Injects DestroyRef to automatically handle (destroy) subscriptions
  destroyRef = inject(DestroyRef);


  // INFINITY SCROLL VARIABLES
  private currentPage = new BehaviorSubject<number>(1);
  private itemsPerPage = new BehaviorSubject<number>(4);


  // SEARCH VARIABLES
  private searchReview = new BehaviorSubject<string>("");
  public searchReview$ = this.searchReview.asObservable();

  private searchMusic = new BehaviorSubject<string>("");
  public searchMusic$ = this.searchMusic.asObservable();


  // REVIEWS VARIABLES
  // Create an Observable of type BehaviorSubject that will store the reviews banner array.
  private reviewsBanner = new BehaviorSubject<Review[]>([]);
  // Create an Observable for reviewsBanner (read only)
  public reviewsBanner$ = this.reviewsBanner.asObservable();

  private reviewSelected = new BehaviorSubject<Review>(new Review);
  public reviewSelected$ = this.reviewSelected.asObservable();


  // FAVORITES VARIABLES
  private favoriteTvs = new BehaviorSubject<Favorite[]>([]);
  public favoriteTvs$ = this.favoriteTvs.asObservable();

  private favoriteFilms = new BehaviorSubject<Favorite[]>([]);
  public favoriteFilms$ = this.favoriteFilms.asObservable();

  private favoriteCharsMale = new BehaviorSubject<Favorite[]>([]);
  public favoriteCharsMale$ = this.favoriteCharsMale.asObservable();

  private favoriteCharsFemale = new BehaviorSubject<Favorite[]>([]);
  public favoriteCharsFemale$ = this.favoriteCharsFemale.asObservable();

  private favoriteCharsNoIdea = new BehaviorSubject<Favorite[]>([]);
  public favoriteCharsNoIdea$ = this.favoriteCharsNoIdea.asObservable();

  private favoriteSeiyuusMale = new BehaviorSubject<Favorite[]>([]);
  public favoriteSeiyuusMale$ = this.favoriteSeiyuusMale.asObservable();

  private favoriteSeiyuusFemale = new BehaviorSubject<Favorite[]>([]);
  public favoriteSeiyuusFemale$ = this.favoriteSeiyuusFemale.asObservable();

  private favoriteStudios = new BehaviorSubject<Favorite[]>([]);
  public favoriteStudios$ = this.favoriteStudios.asObservable();


  // MUSICS VARIABLES
  private musicOps = new BehaviorSubject<Music[]>([]);
  public musicOps$ = this.musicOps.asObservable();

  private musicEds = new BehaviorSubject<Music[]>([]);
  public musicEds$ = this.musicEds.asObservable();

  private musicOsts = new BehaviorSubject<Music[]>([]);
  public musicOsts$ = this.musicOsts.asObservable();

  private musicDubs = new BehaviorSubject<Music[]>([]);
  public musicDubs$ = this.musicDubs.asObservable();


  constructor(private http: HttpClient) { }


  // INFINITY SCROLL
  public loadReviewsOnScroll(): Observable<Review[]> {
    // Return an Observable
    return combineLatest([this.reviewsBanner, this.currentPage, this.itemsPerPage]).pipe(
      map(([reviews, currentPage, itemsPerPage]) => {
        if (this.searchReview.getValue() === '' || this.searchReview.getValue() === null) {
          let startIndex = (currentPage - 1) * itemsPerPage; // Index showing where it should start get the data
          let endIndex = currentPage * itemsPerPage; // Index showing where it should stop (its exclusionary)

          if (!reviews) {
            console.error('No reviews available in reviewsBanner');
            return [];
          }
          // Get the reviews between startIndex and endIndex (Reviews[])
          return reviews.slice(startIndex, endIndex);
        }

        // If there's some written in the search box...
        return [];
      })
    )
  }

  public updateCurrentPage(currentPage: number) {
    this.currentPage.next(currentPage);
  }

  public updateItemsPerPage(itemsPerPage: number) {
    this.itemsPerPage.next(itemsPerPage);
  }


  // SEARCH
  public updateSearchValue(searchType: string, searchValue: string) {
    switch (searchType) {
      case "review":
        this.searchReview.next(searchValue);
        break;

      case "music":
        this.searchMusic.next(searchValue);
        break;
    }
  }

  public getCurrentSearchValue(searchType: string): string {
    switch (searchType) {
      case "review":
        return this.searchReview.getValue();

      case "music":
        return this.searchMusic.getValue();

      default:
        return "";
    }
  }


  // REVIEWS (or specific review)
  public getAllReviews() {
    // Get all reviews
    this.http.get<Review[]>(`${this.backendDomain}/reviews`).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        // Create date formatting
        const formatter = new Intl.DateTimeFormat('en-us', {
          month: 'long',
          day: '2-digit',
          year: 'numeric'
        })

        const updatedData = data.map(review => {
          // Change date formatting
          review.reviewDate = formatter.format(new Date(review.reviewDate)).toUpperCase();
          review.startDate = formatter.format(new Date(review.startDate)).toUpperCase();
          review.endDate = formatter.format(new Date(review.endDate)).toUpperCase();
          return review;
        })

        this.reviewsBanner.next(updatedData); // Update BehaviorSubject
      },
      error: (err) => {
        console.error('Error on getAllReviews: ', err); // Error message
      }
    });
  }

  public getReview(reviewId: string) {
    this.reviewsBanner.pipe(
      map(reviews =>
        // Searches for the review that matches the review_id
        reviews?.find((review) => review.id === reviewId) || new Review())
    ).subscribe(review => {
      // Saves the found review
      this.reviewSelected.next(review);
    });
  }

  public removeReviewSelected() {
    this.reviewSelected.next(new Review());
  }


  // FAVORITES
  public getFavoritesByType(type: string) {
    // Get reviews by type
    this.http.get<Favorite[]>(`${this.backendDomain}/favorites/${type}`).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      // Save the reviews according to its type
      next: (data) => {
        switch (type) {
          case 'tvs':
            this.favoriteTvs.next(data);
            break;

          case 'films':
            this.favoriteFilms.next(data);
            break;

          case 'chars_male':
            this.favoriteCharsMale.next(data);
            break;

          case 'chars_female':
            this.favoriteCharsFemale.next(data);
            break;

          case 'chars_no_idea':
            this.favoriteCharsNoIdea.next(data);
            break;

          case 'seiyuus_male':
            this.favoriteSeiyuusMale.next(data);
            break;

          case 'seiyuus_female':
            this.favoriteSeiyuusFemale.next(data);
            break;

          case 'studios':
            this.favoriteStudios.next(data);
            break;

          default:
            console.warn(`Unknown type: ${type}`);
        }

      },
      error: (err) => {
        console.error(`Error on getFavoritesByType ${type}: `, err); // Error message
      }
    });
  }


  // MUSICS
  public getMusicsByType(type: string) {
    // Get musics by type
    this.http.get<Music[]>(`${this.backendDomain}/musics/${type}`).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      // Save the musics according to its type
      next: (data) => {
        switch (type) {
          case 'op':
            this.musicOps.next(data);
            break;

          case 'ed':
            this.musicEds.next(data);
            break;

          case 'ost':
            this.musicOsts.next(data);
            break;

          case 'dub':
            this.musicDubs.next(data);
            break;

          default:
            console.warn(`Unknown type: ${type}`);
        }
      },
      error: (err) => {
        console.error(`Error on getMusicsByType ${type}: `, err); // Error message
      }
    });
  }
}