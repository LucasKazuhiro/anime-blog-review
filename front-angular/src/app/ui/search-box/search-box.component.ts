import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnimeService } from '../../services/anime.service';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'search-box',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css'
})
export class SearchBoxComponent implements OnInit {
  @Input() placeholderText: string = "Search...";

  public searchBox!: HTMLInputElement | null;
  public searchValue: string = ""

  // Debounce search (cooldown)
  searchValueDebounce = new Subject<string>();

  // Variable to change magnifier SVG fill color
  isSearchFocused = false;

  constructor(private animeService: AnimeService) {
    this.searchValueDebounce.pipe(debounceTime(400)).subscribe(() => {
      this.updateSearchValue();
    })
  }

  ngOnInit(): void {
    this.searchBox = document.getElementById('search-box') as HTMLInputElement;
  }

  // Updates the searched value
  updateSearchValue() {
    this.animeService.updateSearchValue('review', this.searchValue);
  }

  // Clean search box
  cleanSearchBox() {
    this.searchValue = "";
    this.searchValueDebounce.next('')
    this.focusSearchBox();
  }

  // Change the focus to the search box
  focusSearchBox() {
    if (this.searchBox) this.searchBox.focus();
  }

  // Search box shortcuts
  @HostListener('window:keydown', ['$event'])
  handleSearchBoxShortcut(event: KeyboardEvent) {
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
  }
}
