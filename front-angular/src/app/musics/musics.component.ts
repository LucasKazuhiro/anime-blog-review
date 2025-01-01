import { Component } from '@angular/core';
import { LinkMenuComponent } from '../link-menu/link-menu.component';
import { Music } from '../models/music.model';
import { map, Observable } from 'rxjs';
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

  musicsOpsLoaded = 2;
  musicsEdsLoaded = 5;
  musicsOstsLoaded = 3;

  musicsOpsTotal$: Observable<number>;
  musicsEdsTotal$: Observable<number>;
  musicsOstsTotal$: Observable<number>;

  constructor(private animeService: AnimeService) {
    this.fav_types.forEach(type => {
      animeService.getMusicsByType(type);
    })

    this.musicOps$ = this.animeService.musicOps$;
    this.musicEds$ = this.animeService.musicEds$;
    this.musicOsts$ = this.animeService.musicOsts$;

    this.musicsOpsTotal$ = this.musicOps$.pipe(map(musics => musics?.length || 0));
    this.musicsEdsTotal$ = this.musicEds$.pipe(map(musics => musics?.length || 0));
    this.musicsOstsTotal$ = this.musicOsts$.pipe(map(musics => musics?.length || 0));
  }

  navigateToMusicPage(musicName: string, musicAuthor: string) {
    window.open(`https://www.youtube.com/results?search_query=${musicName}+by+${musicAuthor}`, '_blank');
  }

  showMore(type: string) {
    switch (type) {
      case "op":
        this.musicsOpsLoaded += 5;
        break;

      case "ed":
        this.musicsEdsLoaded += 5;
        break;

      case "ost":
        this.musicsOstsLoaded += 5;
        break;
    }
  }
}
