import { Component, DestroyRef, HostListener, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { AnimeService } from './services/anime.service';
import { LinkMenuComponent } from './link-menu/link-menu.component';
import { CommonModule } from '@angular/common';
import { debounceTime, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserMenuComponent, NavMenuComponent, LinkMenuComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  // Injects DestroyRef to automatically handle (destroy) subscriptions
  destroyRef = inject(DestroyRef);

  // All favorites type
  private fav_types: string[] = ['tvs', 'films', 'chars_male', 'chars_female', 'chars_no_idea', 'seiyuus_male', 'seiyuus_female', 'studios']

  // All types of music
  private music_types: string[] = ['op', 'ed', 'ost']

  public isMenuMobileEnabled: boolean = false;

  // Theme
  public isDarkModeEnabled: boolean = false;
  public isSystemModeEnabled: boolean = false;
  private userTheme = localStorage.getItem('theme');
  private systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Debounce swtich theme (cooldown)
  public toggleThemeDebounce = new Subject();

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

    // Initial theme check
    // If nothing is set up or "system" was the theme chosen...
    if (!this.userTheme || this.userTheme === "system") {
      this.isSystemModeEnabled = true;

      // Checks if the system is in Dark Mode
      if (this.systemTheme) this.activeDarkMode();
      else this.activeLightMode();
    }
    // If "dark" was the theme chosen...
    else if (this.userTheme === "dark") {
      this.isDarkModeEnabled = true;
      this.activeDarkMode();
    }
    // If "light" was the theme chose...
    else if (this.userTheme === "light") {
      this.isDarkModeEnabled = false;
      this.activeLightMode();
    }

    // Create debounce to toggle theme button
    this.toggleThemeDebounce.pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.toggleTheme();
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

    if (event.ctrlKey && event.key === 'b') {
      event.preventDefault(); // Prevent default browser action
      this.toggleTheme();
    }
  }

  // Toggle Mobile Link Menu
  public toggleMobileLinkMenu() {
    document.getElementById('notification-dot')?.classList.add('opacity-0', 'insivible')

    // Opens mobile link menu if its already on top of the page
    if (window.scrollY < 1500) {
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

  // Toggle Theme (system, dark, white)
  public toggleTheme() {
    // Add animation when leaving the screen
    const theme = document.querySelector('.svg-theme');
    if (theme) theme.classList.add("remove-theme");

    setTimeout(() => {
      const systemThemeEnabled = this.isSystemModeEnabled;
      const darkModeEnabled = this.isDarkModeEnabled;

      // Enable Dark Mode
      if (systemThemeEnabled) {
        this.isSystemModeEnabled = false;
        this.isDarkModeEnabled = true;
        this.activeDarkMode();
        localStorage.setItem("theme", "dark");
      }
      // Enable Light Mode
      else if (darkModeEnabled) {
        this.isDarkModeEnabled = false;
        this.activeLightMode();
        localStorage.setItem("theme", "light");
      }
      // Enable System Mode
      else {
        this.isSystemModeEnabled = true;
        if (this.systemTheme) this.activeDarkMode();
        else this.activeLightMode();
        localStorage.setItem("theme", "system");
      }

      if (theme) theme.classList.remove("remove-theme");
    }, 300)
  }

  private activeDarkMode() {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  }

  private activeLightMode() {
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
  }
}