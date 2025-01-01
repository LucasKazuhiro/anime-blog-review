import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, Observable } from 'rxjs';
import { Review } from '../models/review.model';
import { HttpClient } from '@angular/common/http';
import { Favorite } from '../models/favorite.model';
import { Music } from '../models/music.model';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {

  private backend_domain = "korosenku-flask.vercel.app";

  constructor(private http: HttpClient) { }

  // Reviews
  // Create an Observable of type BehaviorSubject that will store the reviews banner array.
  private reviewsBanner = new BehaviorSubject<Review[] | null>(null);
  // Create an Observable for reviewsBanner (read only)
  reviewsBanner$ = this.reviewsBanner.asObservable();

  private reviewSelected = new BehaviorSubject<Review>(new Review);
  reviewSelected$ = this.reviewSelected.asObservable();


  // Favorites
  private favoriteTvs = new BehaviorSubject<Favorite[]>([]);
  favoriteTvs$ = this.favoriteTvs.asObservable();

  private favoriteFilms = new BehaviorSubject<Favorite[]>([]);
  favoriteFilms$ = this.favoriteFilms.asObservable();

  private favoriteCharsMale = new BehaviorSubject<Favorite[]>([]);
  favoriteCharsMale$ = this.favoriteCharsMale.asObservable();

  private favoriteCharsFemale = new BehaviorSubject<Favorite[]>([]);
  favoriteCharsFemale$ = this.favoriteCharsFemale.asObservable();

  private favoriteCharsNoIdea = new BehaviorSubject<Favorite[]>([]);
  favoriteCharsNoIdea$ = this.favoriteCharsNoIdea.asObservable();

  private favoriteSeiyuusMale = new BehaviorSubject<Favorite[]>([]);
  favoriteSeiyuusMale$ = this.favoriteSeiyuusMale.asObservable();

  private favoriteSeiyuusFemale = new BehaviorSubject<Favorite[]>([]);
  favoriteSeiyuusFemale$ = this.favoriteSeiyuusFemale.asObservable();

  private favoriteStudios = new BehaviorSubject<Favorite[]>([]);
  favoriteStudios$ = this.favoriteStudios.asObservable();


  // Musics
  private musicOps = new BehaviorSubject<Music[]>([]);
  musicOps$ = this.musicOps.asObservable();

  private musicEds = new BehaviorSubject<Music[]>([]);
  musicEds$ = this.musicEds.asObservable();

  private musicOsts = new BehaviorSubject<Music[]>([]);
  musicOsts$ = this.musicOsts.asObservable();


  getAllReviews() {
    // Subscribe to the Observable returned by http.get()
    this.http.get<Review[]>(`https://${this.backend_domain}/reviews`).subscribe({
      next: (data) => {
        const formatter = new Intl.DateTimeFormat('en-us', {
          month: 'long',
          day: '2-digit',
          year: 'numeric'
        })

        const updatedData = data.map(review => {
          // Change date format
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
    })
  }

  getReview(reviewId: string) {
    this.reviewsBanner.pipe(
      map(reviews =>
        // Searches for the review that matches the review_id
        reviews?.find((review) => review.id === reviewId) || new Review())
    ).subscribe(review => {
      // Saves the found review
      this.reviewSelected.next(review);
    });
  }

  getFavoritesByType(type: string) {
    this.http.get<Favorite[]>(`https://${this.backend_domain}/favorites/${type}`).subscribe({
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
    })
  }

  getMusicsByType(type: string) {
    this.http.get<Music[]>(`https://${this.backend_domain}/musics/${type}`).subscribe({
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

          default:
            console.warn(`Unknown type: ${type}`);
        }
      },
      error: (err) => {
        console.error(`Error on getMusicsByType ${type}: `, err); // Error message
      }
    })
  }
}