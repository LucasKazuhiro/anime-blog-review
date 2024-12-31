import { Component } from '@angular/core';
import { LinkMenuComponent } from '../link-menu/link-menu.component';
import { ActivatedRoute } from '@angular/router';
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


  constructor(private route: ActivatedRoute, private animeService: AnimeService) {
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

}
