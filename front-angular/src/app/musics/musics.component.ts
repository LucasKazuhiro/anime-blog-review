import { Component } from '@angular/core';
import { LinkMenuComponent } from '../link-menu/link-menu.component';
import { Music } from '../models/music.model';
import { Observable } from 'rxjs';
import { AnimeService } from '../services/anime.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'musics',
  imports: [LinkMenuComponent, CommonModule],
  templateUrl: './musics.component.html',
  styleUrl: './musics.component.css'
})
export class MusicsComponent {
  musicOps$: Observable<Music[] | null>;
  musicEds$: Observable<Music[] | null>;
  musicOsts$: Observable<Music[] | null>;

  fav_types: string[] = ['op', 'ed', 'ost']

  constructor(private animeService: AnimeService) {
    this.fav_types.forEach(type => {
      animeService.getMusicsByType(type);
    })

    this.musicOps$ = this.animeService.musicOps$;
    this.musicEds$ = this.animeService.musicEds$;
    this.musicOsts$ = this.animeService.musicOsts$;
  }

  navigateToMusicPage(musicName: string) {
    window.open(`https://www.youtube.com/results?search_query=${musicName}`, '_blank');
  }
}
