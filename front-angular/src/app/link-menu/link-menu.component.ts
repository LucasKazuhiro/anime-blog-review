import { Component, Input } from '@angular/core';
import { TooltipComponent } from '../ui/tooltip/tooltip.component';

@Component({
    selector: 'link-menu',
    imports: [TooltipComponent],
    templateUrl: './link-menu.component.html',
    styleUrl: './link-menu.component.css'
})
export class LinkMenuComponent {
    // Get the IDs via input
    @Input() idRedactor: string = ""
    @Input() idPodcasts: string = "";
    @Input() idLinks: string = "";
    @Input() idFlowcharts: string = "";

    // Get the Positions via input
    @Input() positionRedactor: string = ""
    @Input() positionPodcasts: string = "";
    @Input() positionLinks: string = "";
    @Input() positionFlowcharts: string = "";
}
