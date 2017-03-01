import { Component } from '@angular/core';

@Component({
    selector: 'schedule',
    templateUrl: 'schedule.component.html'
})

export class ScheduleComponent {
    isActive = false;
    showMenu = '';
    eventCalled() {
        this.isActive = !this.isActive;
    }
    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }
}