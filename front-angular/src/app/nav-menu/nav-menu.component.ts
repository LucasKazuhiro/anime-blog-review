import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { Review } from '../models/review.model';
import { AnimeService } from '../services/anime.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'nav-menu',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css'
})
export class NavMenuComponent implements OnInit {
  // Injects DestroyRef to automatically handle (destroy) subscriptions
  private destroyRef = inject(DestroyRef);

  private reviewSelected: Review = new Review();
  public activeColor: string = "";

  constructor(private router: Router, private animeService: AnimeService) { }

  ngOnInit() {
    // Saves the selected review
    this.animeService.reviewSelected$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((review) => {
      if (review) this.reviewSelected = review;
    })

    // If the page change occurred without problems, update menu button color
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateActivePageColor();
      }
    })
  };

  // Calculates the position of the dot (on hover)
  public calcCenterDot(btn_menu: EventTarget | null) {
    // Check if EventTarget item is a HTMLElement
    if (btn_menu instanceof HTMLElement) {
      // Calculates the correct position of the dot
      const btn_menu_width = btn_menu.offsetWidth;
      const before_width = parseFloat(getComputedStyle(btn_menu, '::before').width);
      const center_value = (btn_menu_width - before_width) / 2;

      // Set the value in the translateX attribute
      const btn_menu_id = document.getElementById(btn_menu.id)?.style;
      if (btn_menu_id) {
        btn_menu_id.setProperty('--var-move-dot', `translateX(${center_value}px)`);
      }
    }
  }

  // Change menu button color dynamically
  private updateActivePageColor() {
    const currentPage = this.router.url;

    switch (currentPage) {
      case "/":
      case "/reviews":
        this.activeColor = "#cf3d6e";
        break;

      case "/favorites":
        this.activeColor = '#e4a42d';
        break;

      case "/musics":
        this.activeColor = '#14afc4';
        break;
    }

    if (currentPage.includes('/review/')) {
      this.activeColor = "#cf3d6e";
    }
  }

  // Checks if the route is active (for '/' and '/review')
  public isRouteActive(): boolean {
    if (this.router.url === '/') return true;
    if (this.router.url.includes('/review/')) return true;
    return false;
  }

  // Handle reviews menu button
  public goToReviewsPage() {
    // If the user is in /review or there is no review selected
    if (this.router.url.includes('/review/') || this.reviewSelected === null) {
      this.animeService.removeReviewSelected(); // Clean the reviewSelected
      this.router.navigate(['/'])  // Go to home page
    }
    // If there is a review selected
    else if (this.reviewSelected != null) {
      this.router.navigate([`/review/${this.reviewSelected.id}`]) // Go to /review page
    }
  }
}
