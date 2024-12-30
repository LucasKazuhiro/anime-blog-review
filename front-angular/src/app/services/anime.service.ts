import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Review } from '../models/review.model';
import { HttpClient } from '@angular/common/http';
import { Favorite } from '../models/favorite.model';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {

  private backend_domain = "korosenku-flask.vercel.app";

  constructor(private http: HttpClient) { }

  // Create an Observable of type BehaviorSubject that will store the reviews banner array.
  private reviewsBanner = new BehaviorSubject<Review[]>([]);
  // Create an Observable for reviewsBanner (read only)
  reviewsBanner$ = this.reviewsBanner.asObservable();

  private reviewSelected = new BehaviorSubject<Review>(new Review);
  reviewSelected$ = this.reviewSelected.asObservable();

  private favoriteTvs = new BehaviorSubject<Favorite[]>([]);
  favoriteTvs$ = this.favoriteTvs.asObservable();


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
        reviews.find((review) => review.id === reviewId) || new Review())  // Fin
    ).subscribe(review => {
      // Saves the found review
      this.reviewSelected.next(review);
    });
  }

  getFavoritesByType(type: string) {
    this.http.get<Favorite[]>(`https://${this.backend_domain}/favorites/${type}`).subscribe({
      next: (data) => {
        this.favoriteTvs.next(data);
      },
      error: (err) => {
        console.error(`Error on getFavoritesByType ${type}: `, err); // Error message
      }
    })
  }
}