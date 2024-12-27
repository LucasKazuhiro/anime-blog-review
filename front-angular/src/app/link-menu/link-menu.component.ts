import { Component } from '@angular/core';
import { TooltipComponent } from '../ui/tooltip/tooltip.component';

@Component({
  selector: 'link-menu',
  standalone: true,
  imports: [TooltipComponent],
  templateUrl: './link-menu.component.html',
  styleUrl: './link-menu.component.css'
})
export class LinkMenuComponent {

}
