import { Component } from '@angular/core';

@Component({
    selector: 'nav-menu',
    imports: [],
    templateUrl: './nav-menu.component.html',
    styleUrl: './nav-menu.component.css'
})
export class NavMenuComponent {
  calcCenterDot(btn_menu: EventTarget | null) {
    // Check if EventTarget item is a HTMLElement
    if (btn_menu instanceof HTMLElement) {
      // Calculates the correct position of the dot
      const btn_menu_width = btn_menu.offsetWidth;
      const before_width = parseFloat(getComputedStyle(btn_menu, '::before').width);
      const center_value = (btn_menu_width - before_width) / 2;

      // Set the value in the translateX attribute
      const btn_menu_id = document.getElementById(btn_menu.id)?.style;
      if (btn_menu_id) {
        btn_menu_id.setProperty('--var-move-dot', `translateX(${center_value}px)`)
      }
    }
  }
}
