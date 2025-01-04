import { Component } from '@angular/core';
import { LinkMenuComponent } from '../link-menu/link-menu.component';
import { Music } from '../models/music.model';
import { AnimeService } from '../services/anime.service';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'musics',
  imports: [LinkMenuComponent, CommonModule],
  templateUrl: './musics.component.html',
  styleUrl: './musics.component.css'
})
export class MusicsComponent {
  // Variables to store the musics array
  public musicsOps: Music[] = [];
  public musicsEds: Music[] = [];
  public musicsOsts: Music[] = [];

  // All types of music
  fav_types: string[] = ['op', 'ed', 'ost']

  // Variable to store the number of musics loaded in the screen
  musicsOpsLoaded = 2;
  musicsEdsLoaded = 5;
  musicsOstsLoaded = 3;

  constructor(private animeService: AnimeService) {
    // Loop to get all types of music
    this.fav_types.forEach(type => {
      animeService.getMusicsByType(type);
    })

    // Store the musics
    this.animeService.musicOps$.pipe(takeUntilDestroyed()).subscribe(data => {
      this.musicsOps = data;
    });

    this.animeService.musicEds$.pipe(takeUntilDestroyed()).subscribe(data => {
      this.musicsEds = data;
    });

    this.animeService.musicOsts$.pipe(takeUntilDestroyed()).subscribe(data => {
      this.musicsOsts = data;
    });
  }

  // Function to send the user to an external website
  navigateToMusicPage(musicName: string, musicAuthor: string) {
    window.open(`https://www.youtube.com/results?search_query=${musicName}+by+${musicAuthor}`, '_blank');
  }

  // Function to load more music
  showMore(type: string) {
    switch (type) {
      // Load new musics one by one, creating a good visual effect
      case "op":
        for (let i = 1; i <= 5; i++) {
          setTimeout(() => {
            this.musicsOpsLoaded += 1;
          }, i * 30)
        }
        break;

      case "ed":
        for (let i = 1; i <= 5; i++) {
          setTimeout(() => {
            this.musicsEdsLoaded += 1;
          }, i * 30)
        }
        break;

      case "ost":
        for (let i = 1; i <= 5; i++) {
          setTimeout(() => {
            this.musicsOstsLoaded += 1;
          }, i * 30)
        }
        break;
    }
  }
}
