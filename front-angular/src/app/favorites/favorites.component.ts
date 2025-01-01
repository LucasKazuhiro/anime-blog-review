import { Component } from '@angular/core';
import { LinkMenuComponent } from '../link-menu/link-menu.component';
import { AnimeService } from '../services/anime.service';
import { Favorite } from '../models/favorite.model';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'favorites',
  imports: [LinkMenuComponent, CommonModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {
  favoriteTvs$: Observable<Favorite[] | null>;
  favoriteFilms$: Observable<Favorite[] | null>;
  favoriteCharsMale$: Observable<Favorite[] | null>;
  favoriteCharsFemale$: Observable<Favorite[] | null>;
  favoriteCharsNoIdea$: Observable<Favorite[] | null>;
  favoriteSeiyuusMale$: Observable<Favorite[] | null>;
  favoriteSeiyuusFemale$: Observable<Favorite[] | null>;
  favoriteStudios$: Observable<Favorite[] | null>;

  fav_types: string[] = ['tvs', 'films', 'chars_male', 'chars_female', 'chars_no_idea', 'seiyuus_male', 'seiyuus_female', 'studios']

  borderLightColor: string[] = [
    'rgba(209, 49, 89, 1)',    // Tv Series    (0)
    'rgba(228, 152, 53, 1)',   // Films        (1)
    'rgba(30, 135, 214, 1)',   // Char Male    (2)
    'rgba(219, 92, 213, 1)',   // Char Female  (3)
    'rgba(255, 229, 0, 1)',    // Char No Idea (4)
    'rgba(52, 224, 173, 1)',   // Seiyuu Male  (5)
    'rgba(144, 75, 222, 1)',   // Seiyuu Female(6)
    'rgba(71, 207, 0, 1)'      // Studio       (7)
  ];


  constructor(private animeService: AnimeService) {
    this.fav_types.forEach(type => {
      animeService.getFavoritesByType(type);
    })

    this.favoriteTvs$ = this.animeService.favoriteTvs$;
    this.favoriteFilms$ = this.animeService.favoriteFilms$;
    this.favoriteCharsMale$ = this.animeService.favoriteCharsMale$;
    this.favoriteCharsFemale$ = this.animeService.favoriteCharsFemale$;
    this.favoriteCharsNoIdea$ = this.animeService.favoriteCharsNoIdea$;
    this.favoriteSeiyuusMale$ = this.animeService.favoriteSeiyuusMale$;
    this.favoriteSeiyuusFemale$ = this.animeService.favoriteSeiyuusFemale$;
    this.favoriteStudios$ = this.animeService.favoriteStudios$;
  }


  onMouseMove(event: MouseEvent) {
    const allContentBox = document.querySelectorAll<HTMLElement>(".content-box");

    allContentBox.forEach(contentBox => {
      const rect = contentBox.getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;

      contentBox.style.setProperty('--mouse-x', `${x}px`);
      contentBox.style.setProperty('--mouse-y', `${y}px`);
    });
  }

  navigateToAnimePage(url: string) {
    window.open(url, '_blank');
  }
}
