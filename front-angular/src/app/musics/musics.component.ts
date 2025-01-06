import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { LinkMenuComponent } from '../link-menu/link-menu.component';
import { Music } from '../models/music.model';
import { AnimeService } from '../services/anime.service';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchBoxComponent } from '../ui/search-box/search-box.component';
import Fuse from 'fuse.js';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'musics',
  imports: [LinkMenuComponent, CommonModule, SearchBoxComponent],
  templateUrl: './musics.component.html',
  styleUrl: './musics.component.css'
})
export class MusicsComponent implements OnInit {
  // Injects DestroyRef to automatically handle (destroy) subscriptions
  private destroyRef = inject(DestroyRef);

  // Fuse.js
  private fuseOptions = {
    // minMatchCharLength: 1,
    threshold: 0.3,
    ignoreLocation: true,
    keys: [
      "name",
      "anime",
      "author"
    ]
  };
  private fuse: Fuse<Music> = new Fuse([], this.fuseOptions);

  // Variables to store the musics array
  public allMusicsOps: Music[] = [];
  public displayMusicsOps: Music[] = [];

  public allMusicsEds: Music[] = [];
  public displayMusicsEds: Music[] = [];

  public allMusicsOsts: Music[] = [];
  public displayMusicsOsts: Music[] = [];


  // Variable to store the number of musics loaded in the screen
  public musicsOpsLoaded = 5;
  public musicsEdsLoaded = 5;
  public musicsOstsLoaded = 5;

  constructor(private animeService: AnimeService) { }

  ngOnInit() {
    // Combine the streams of observables
    combineLatest([
      this.animeService.musicOps$,
      this.animeService.musicEds$,
      this.animeService.musicOsts$
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([ops, eds, osts]) => {
        // Update the arrays that store all values of each type of music
        this.allMusicsOps = ops;
        this.allMusicsEds = eds;
        this.allMusicsOsts = osts;

        // At the beginning, display all data
        this.displayMusicsOps = this.allMusicsOps;
        this.displayMusicsEds = this.allMusicsEds;
        this.displayMusicsOsts = this.allMusicsOsts;

        // Combine the arrays (to search)
        const combinedData = [...this.allMusicsOps, ...this.allMusicsEds, ...this.allMusicsOsts];

        // Update Fuse collection
        this.fuse.setCollection(combinedData);
      });


    // Get searched value
    this.animeService.searchMusic$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(searchMusic => {
      this.handleSearch(searchMusic);
    })
  }

  // Search the anime name
  private handleSearch(searchMusic: string) {
    if (searchMusic) {
      // Return all possible matches
      let searchedMatches = this.fuse.search(searchMusic).map(result => result.item);

      // Use reduce to group musics by type
      const categorizedMusics = searchedMatches.reduce<{
        openings: Music[],
        endings: Music[],
        osts: Music[]
      }>
        ((acc, item: Music) => {
          switch (item.type) {
            case "opening":
              acc.openings.push(item);
              break;

            case "ending":
              acc.endings.push(item);
              break;

            case "originalSoundtrack":
              acc.osts.push(item);
              break;

            default:
          }
          return acc;
        }, { openings: [], endings: [], osts: [] });

      // Saves the searched data according to its type
      this.displayMusicsOps = categorizedMusics.openings;
      this.displayMusicsEds = categorizedMusics.endings;
      this.displayMusicsOsts = categorizedMusics.osts;
    }
    else {
      // If input is empty, return all musics of all types
      this.displayMusicsOps = this.allMusicsOps;
      this.displayMusicsEds = this.allMusicsEds;
      this.displayMusicsOsts = this.allMusicsOsts;
    }
  }

  // Function to send the user to an external website
  public navigateToMusicPage(musicName: string, musicAuthor: string) {
    window.open(`https://www.youtube.com/results?search_query=${musicName}+by+${musicAuthor}`, '_blank');
  }

  // Function to load more music
  public showMore(type: string) {
    switch (type) {
      // Load new musics one by one, creating a good visual effect
      case "op":
        for (let i = 1; i <= 5; i++) {
          setTimeout(() => {
            this.musicsOpsLoaded += 1;
          }, i * 30);
        }
        break;

      case "ed":
        for (let i = 1; i <= 5; i++) {
          setTimeout(() => {
            this.musicsEdsLoaded += 1;
          }, i * 30);
        }
        break;

      case "ost":
        for (let i = 1; i <= 5; i++) {
          setTimeout(() => {
            this.musicsOstsLoaded += 1;
          }, i * 30);
        }
        break;
    }
  }
}
