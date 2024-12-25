import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { AnimeService } from './services/anime.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserMenuComponent, NavMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private animeService: AnimeService) { }

  ngOnInit() {
    this.animeService.getAllReviews();
  }
}