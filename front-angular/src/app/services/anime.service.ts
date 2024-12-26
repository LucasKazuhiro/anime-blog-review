import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Review } from '../models/review.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {

  constructor(private http: HttpClient) { }

  // Create an Observable of type BehaviorSubject that will store the reviews banner array.
  private reviewsBanner = new BehaviorSubject<Review[]>([]);
  // Create an Observable for reviewsBanner (read only)
  reviewsBanner$ = this.reviewsBanner.asObservable();


  getAllReviews() {
    // Subscribe to the Observable returned by http.get()
    this.http.get<Review[]>("https://korosenku-flask.vercel.app/reviews").subscribe({
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
        console.error('Error: ', err); // Error mensage
      }
    })
  }
}
