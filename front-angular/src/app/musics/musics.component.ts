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


  // Varibles to store the searched value and search results
  public searchedMusic: string = "";
  public searchedResults: { openings: Music[]; endings: Music[]; osts: Music[] } = {
    openings: [],
    endings: [],
    osts: []
  };

  // Types selected
  private typesForSearch: string[] = [];
  public openingEnabled: boolean = false;
  public endingEnabled: boolean = false;
  public ostEnabled: boolean = false;

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
      this.searchedMusic = searchMusic;
      this.handleSearch(searchMusic);
    })
  }

  // Search the anime name
  private handleSearch(searchMusic: string) {
    if (searchMusic) {
      // Return all possible matches in a full search
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

      this.searchedResults = categorizedMusics;
      this.updateDisplaySearchResults();
    }
    else {
      // Reset number of loaded musics of each music type
      this.musicsOpsLoaded = 5;
      this.musicsEdsLoaded = 5;
      this.musicsOstsLoaded = 5;

      // If input is empty, return all musics of all types
      this.displayMusicsOps = this.allMusicsOps;
      this.displayMusicsEds = this.allMusicsEds;
      this.displayMusicsOsts = this.allMusicsOsts;
    }
  }

  // Filter musics by type (op, ed, ost)
  editMusicTypeSearch(type: string) {
    // Block filters if theres no searched value
    if (this.searchedMusic !== '') {
      if (!this.typesForSearch.includes(type)) {
        // Add the type in the array
        this.typesForSearch.push(type);

        // Change the button color
        switch (type) {
          case "opening":
            this.openingEnabled = true;
            break;

          case "ending":
            this.endingEnabled = true;
            break;

          case "originalSoundtrack":
            this.ostEnabled = true;
            break;
        }
      }
      else {
        // Remote the type from the array
        this.typesForSearch = this.typesForSearch.filter(item => item !== type);

        // Remove the button color
        switch (type) {
          case "opening":
            this.openingEnabled = false;
            break;

          case "ending":
            this.endingEnabled = false;
            break;

          case "originalSoundtrack":
            this.ostEnabled = false;
            break;
        }
      }

      this.updateDisplaySearchResults();
    }
  }

  private updateDisplaySearchResults() {
    // Clean all arrays of music
    this.displayMusicsOps = []
    this.displayMusicsEds = []
    this.displayMusicsOsts = []

    if (this.typesForSearch.length !== 0) {
      // Returns the music types results specified
      if (this.typesForSearch.includes('opening')) this.displayMusicsOps = this.searchedResults.openings;
      if (this.typesForSearch.includes('ending')) this.displayMusicsEds = this.searchedResults.endings;
      if (this.typesForSearch.includes('originalSoundtrack')) this.displayMusicsOsts = this.searchedResults.osts;
    }
    else {
      // Returns all music types results
      this.displayMusicsOps = this.searchedResults.openings;
      this.displayMusicsEds = this.searchedResults.endings;
      this.displayMusicsOsts = this.searchedResults.osts;
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
