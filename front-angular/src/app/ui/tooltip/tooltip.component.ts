import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.css'
})
  export class TooltipComponent {
  @Input() tooltip_id: string = "";
  @Input() x: number = 0;
  @Input() text: string = "";

  public isTooltipActive: boolean = false;

  // Fuction to enable or disable the tooltip box
  showTooltip(isActive: boolean) {
    this.isTooltipActive = isActive;
    let tooltip = document.getElementById(this.tooltip_id);

    // Animation of the tooltip coming from bottom
    if (this.isTooltipActive) {
      tooltip?.classList.add("-translate-y-11")
      tooltip?.classList.remove("translate-y-0")
    }
    else {
      tooltip?.classList.remove("-translate-y-11")
      tooltip?.classList.add("translate-y-0")
    }
  }
}