import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, input, Input } from '@angular/core';

@Component({
  selector: 'tooltip',
  imports: [CommonModule],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.css'
})
export class TooltipComponent implements AfterViewInit {
  // Get some variables via input
  @Input() id: string = ""
  @Input() text: string = "";
  @Input() position: string = "";

  public isTooltipActive: boolean = false;
  public moveToTheLeft: number = 0;

  ngAfterViewInit() {
    const tooltipBox = document.getElementById(this.id);
    const arrowDown = tooltipBox?.querySelector('p');

    if (tooltipBox && arrowDown) {
      switch (this.position) {
        case "left":
          tooltipBox.style.left = `-25px`;
          arrowDown.style.left = `15.5%`;
          break;

        case "center":
          // Calculates the number of pixels to the left that the toolbox needs to move.
          this.moveToTheLeft = (tooltipBox.getBoundingClientRect().width / 2) - 10;
          tooltipBox.style.left = `-${this.moveToTheLeft}px`;

          arrowDown.style.left = `50%`;
          break

        case "right":

          break;
      }
    }
  }

  // Fuction to enable or disable the tooltip box
  public showTooltip(isActive: boolean) {
    this.isTooltipActive = isActive;
  }
}