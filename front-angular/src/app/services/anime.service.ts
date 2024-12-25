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
        this.reviewsBanner.next(data); // Update BehaviorSubject
      },
      error: (err) => {
        console.error('Error: ', err); // Error mensage
      }
    })
  }
}
