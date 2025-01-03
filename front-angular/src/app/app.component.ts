import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { AnimeService } from './services/anime.service';
import { LinkMenuComponent } from './link-menu/link-menu.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserMenuComponent, NavMenuComponent, LinkMenuComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private animeService: AnimeService) { }

  ngOnInit() {
    // Get all reviews
    this.animeService.getAllReviews();
  }

  toggleMobileLinkMenu() {
    // Get the Mobile menu and its Title
    const linkMenuMobile = document.getElementById('link-menu-mobile')?.classList;
    const linkMenuMobileTitle = document.getElementById('link-menu-mobile-title')?.classList;
    const blackScreen = document.getElementById('black-screen')?.classList;

    if (linkMenuMobile && linkMenuMobileTitle && blackScreen) {
      // Is VISIBLE and needs to disapear
      if (linkMenuMobile.contains('left-2')) {
        // Title
        linkMenuMobileTitle.remove('top-[10px]', 'visible');
        linkMenuMobileTitle.add('-top-[50px]', 'invisible');

        // Menu mobile
        linkMenuMobile.remove('left-2', 'visible');
        linkMenuMobile.add('-left-[420px]', 'invisible');

        // Black screen
        blackScreen.remove('opacity-70', 'z-[19]')
        blackScreen.add('opacity-0', 'z-[0]')
      }
      // Is INVISIBLE and needs to appear
      else {
        // Title
        linkMenuMobileTitle.add('top-[10px]', 'visible');
        linkMenuMobileTitle.remove('-top-[50px]', 'invisible');

        // Menu mobile
        linkMenuMobile.add('left-2', 'visible');
        linkMenuMobile.remove('-left-[420px]', 'invisible');

        // Black screen
        blackScreen.add('opacity-70', 'z-[19]')
        blackScreen.remove('opacity-0', 'z-[0]')
      }
    }
  }
}