import { Component } from '@angular/core';
import { LinkMenuComponent } from '../link-menu/link-menu.component';
import { Music } from '../models/music.model';
import { delay, map, Observable } from 'rxjs';
import { AnimeService } from '../services/anime.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'musics',
  imports: [LinkMenuComponent, CommonModule],
  templateUrl: './musics.component.html',
  styleUrl: './musics.component.css'
})
export class MusicsComponent {
  // Variables to store the musics array
  musicOps$: Observable<Music[] | null>;
  musicEds$: Observable<Music[] | null>;
  musicOsts$: Observable<Music[] | null>;

  // All types of music
  fav_types: string[] = ['op', 'ed', 'ost']

  // Variable to store the number of musics loaded in the screen
  musicsOpsLoaded = 2;
  musicsEdsLoaded = 5;
  musicsOstsLoaded = 3;

  // Variable to store to total number of musics
  musicsOpsTotal$: Observable<number>;
  musicsEdsTotal$: Observable<number>;
  musicsOstsTotal$: Observable<number>;

  constructor(private animeService: AnimeService) {
    // Loop to get all types of music
    this.fav_types.forEach(type => {
      animeService.getMusicsByType(type);
    })

    // Store the musics
    this.musicOps$ = this.animeService.musicOps$;
    this.musicEds$ = this.animeService.musicEds$;
    this.musicOsts$ = this.animeService.musicOsts$;

    // Store the total number of musics of each type
    this.musicsOpsTotal$ = this.musicOps$.pipe(map(musics => musics?.length || 0));
    this.musicsEdsTotal$ = this.musicEds$.pipe(map(musics => musics?.length || 0));
    this.musicsOstsTotal$ = this.musicOsts$.pipe(map(musics => musics?.length || 0));
  }

  // Function to send the user to an external website
  navigateToMusicPage(musicName: string, musicAuthor: string) {
    window.open(`https://www.youtube.com/results?search_query=${musicName}+by+${musicAuthor}`, '_blank');
  }

  // Function to load more music
  showMore(type: string) {
    switch (type) {
      case "op":
        for (let i = 1; i <= 5; i++) {
          setTimeout(() => {
            this.musicsOpsLoaded += 1;
          }, i * 100)
        }
        break;

      case "ed":
        for (let i = 1; i <= 5; i++) {
          setTimeout(() => {
            this.musicsEdsLoaded += 1;
          }, i * 100)
        }
        break;

      case "ost":
        for (let i = 1; i <= 5; i++) {
          setTimeout(() => {
            this.musicsOstsLoaded += 1;
          }, i * 100)
        }
        break;
    }
  }
}
