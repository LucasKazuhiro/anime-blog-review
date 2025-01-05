import { Component, HostListener, OnInit } from '@angular/core';
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

  // All favorites type
  private fav_types: string[] = ['tvs', 'films', 'chars_male', 'chars_female', 'chars_no_idea', 'seiyuus_male', 'seiyuus_female', 'studios']

  // All types of music
  private music_types: string[] = ['op', 'ed', 'ost']

  private isMenuMobileLocked: boolean = false;

  constructor(private animeService: AnimeService) { }

  ngOnInit() {
    // Get all reviews
    this.animeService.getAllReviews();

    // Loop to get all favorites of each type
    this.fav_types.forEach(type => {
      this.animeService.getFavoritesByType(type);
    })

    // Loop to get all types of music
    this.music_types.forEach(type => {
      this.animeService.getMusicsByType(type);
    })
  }

  // Search box shortcuts
  @HostListener('window:keydown', ['$event'])
  public handleSearchBoxShortcut(event: KeyboardEvent) {
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

  toggleMobileLinkMenu() {
    // Prevents the mobile menu from being triggered multiple times when clicked
    if (this.isMenuMobileLocked) return;

    this.isMenuMobileLocked = true;

    setTimeout(() => {
      this.isMenuMobileLocked = false;
    }, 800)

    // Get the Mobile menu and its Title
    const linkMenuMobile = document.getElementById('link-menu-mobile')?.classList;
    const linkMenuMobileTitle = document.getElementById('link-menu-mobile-title')?.classList;
    const blackScreen = document.getElementById('black-screen')?.classList;

    const notficationDotOne = document.getElementById('notification-dot-1')
    const notficationDotTwo = document.getElementById('notification-dot-2')
    notficationDotOne?.remove()
    notficationDotTwo?.remove()

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
        blackScreen.remove('opacity-95')
        blackScreen.add('opacity-0')

        setTimeout(() => {
          blackScreen.remove('z-[19]')
          blackScreen.add('z-0')
        }, 500)
      }
      // Is INVISIBLE and needs to appear
      else {
        if (window.scrollY !== 0) {
          // Scrolls to the top of the page
          window.scrollTo({ top: 0, behavior: 'smooth' });

          // Wait scroll up
          setTimeout(() => {
            // Title
            linkMenuMobileTitle.add('top-[10px]', 'visible');
            linkMenuMobileTitle.remove('-top-[50px]', 'invisible');

            // Menu mobile
            linkMenuMobile.add('left-2', 'visible');
            linkMenuMobile.remove('-left-[420px]', 'invisible');

            // Black screen
            blackScreen.add('opacity-95', 'z-[19]');
            blackScreen.remove('opacity-0', 'z-0');
          }, 800);
        } else {
          // Runs immediately if the user is alreay on top of the page
          // Title
          linkMenuMobileTitle.add('top-[10px]', 'visible');
          linkMenuMobileTitle.remove('-top-[50px]', 'invisible');

          // Menu mobile
          linkMenuMobile.add('left-2', 'visible');
          linkMenuMobile.remove('-left-[420px]', 'invisible');

          // Black screen
          blackScreen.add('opacity-95', 'z-[19]');
          blackScreen.remove('opacity-0', 'z-0');
        }
      }
    }

  }
}