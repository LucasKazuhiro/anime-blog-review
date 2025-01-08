import { Component } from '@angular/core';
import { TooltipComponent } from '../ui/tooltip/tooltip.component';

@Component({
    selector: 'user-menu',
    imports: [TooltipComponent],
    templateUrl: './user-menu.component.html',
    styleUrl: './user-menu.component.css'
})
export class UserMenuComponent { }
