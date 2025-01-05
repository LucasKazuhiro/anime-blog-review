import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnimeService } from '../../services/anime.service';
import { debounceTime, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'search-box',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css'
})
export class SearchBoxComponent implements OnInit {
  @Input() type: string = "";
  @Input() placeholderText: string = "Search...";

  // Injects DestroyRef to automatically handle (destroy) subscriptions
  destroyRef = inject(DestroyRef);

  public searchBox: HTMLInputElement | null = null;
  public searchValue: string = "";

  // Debounce search (cooldown)
  public searchValueDebounce = new Subject<string>();

  // Variable to change magnifier SVG fill color
  public isSearchFocused = false;

  constructor(private animeService: AnimeService) { }

  ngOnInit(): void {
    // Adds a debounce when updating search value
    this.searchValueDebounce.pipe(debounceTime(400), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.updateSearchValue();
    })

    // Get the searched value and displays it in the search box
    this.searchValue = this.animeService.getCurrentSearchValue(this.type);

    // Get the search box element
    this.searchBox = document.getElementById('search-box') as HTMLInputElement;
  }

  // Updates the searched value
  private updateSearchValue() {
    this.animeService.updateSearchValue(this.type, this.searchValue);
  }

  // Clean search box
  public cleanSearchBox() {
    this.searchValue = "";
    this.searchValueDebounce.next('')
    this.focusSearchBox();
  }

  // Change the focus to the search box
  public focusSearchBox() {
    if (this.searchBox) this.searchBox.focus();
  }
}
