import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'nav-menu',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css'
})
export class NavMenuComponent implements OnInit, OnDestroy {

  private routerSubscription!: Subscription;
  activeColor: string = ""

  constructor(private router: Router) { }

  ngOnInit() {
    // If the page change occurred without problems, update menu button color
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateActivePageColor()
      }
    })
  };

  ngOnDestroy(): void {
    // Destroy routerSubscription
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe;
    }
  }

  // Calculates the position of the dot (on hover)
  calcCenterDot(btn_menu: EventTarget | null) {
    // Check if EventTarget item is a HTMLElement
    if (btn_menu instanceof HTMLElement) {
      // Calculates the correct position of the dot
      const btn_menu_width = btn_menu.offsetWidth;
      const before_width = parseFloat(getComputedStyle(btn_menu, '::before').width);
      const center_value = (btn_menu_width - before_width) / 2;

      // Set the value in the translateX attribute
      const btn_menu_id = document.getElementById(btn_menu.id)?.style;
      if (btn_menu_id) {
        btn_menu_id.setProperty('--var-move-dot', `translateX(${center_value}px)`)
      }
    }
  }

  // Change menu button color dynamically
  updateActivePageColor() {
    const currentPage = this.router.url;

    switch (currentPage) {
      case "/reviews":
      case "/":
        this.activeColor = "#cf3d6e"
        break

      case "/favorites":
        this.activeColor = '#e4a42d'
        break

      case "/musics":
        this.activeColor = '#14afc4'
        break
    }
  }

  // Checks if the route is active (for '/' and '/review')
  isRouteActive(): boolean {
    if (this.router.url === '/') {
      return true
    }

    if (this.router.url.includes('/review/')) {
      return true;
    }

    return false;
  }
}
