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

  public isMenuMobileEnabled: boolean = false;

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

  public toggleMobileLinkMenu() {
    // Opens mobile link menu if its already on top of the page
    if (window.scrollY < 700) {
      this.isMenuMobileEnabled = !this.isMenuMobileEnabled;
    }
    // Scrolls to the top of the page and then opens mobile link menu
    else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        this.isMenuMobileEnabled = !this.isMenuMobileEnabled;
      }, 500);
    }
  }
}