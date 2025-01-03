import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'tooltip',
    imports: [CommonModule],
    templateUrl: './tooltip.component.html',
    styleUrl: './tooltip.component.css'
})
export class TooltipComponent {
  // Get some variables via input
  @Input() x: number = 0;
  @Input() text: string = "";

  public isTooltipActive: boolean = false;

  // Fuction to enable or disable the tooltip box
  showTooltip(isActive: boolean) {
    this.isTooltipActive = isActive;
  }
}