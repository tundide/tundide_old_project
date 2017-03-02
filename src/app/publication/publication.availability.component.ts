import { Component } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import {
  startOfDay,
  endOfDay
} from 'date-fns';


export const colors: any = {
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'publication-availability',
  styleUrls: ['publication.availability.component.scss'],
  templateUrl: 'publication.availability.component.html'
})
export class PublicationAvailabilityComponent {

  events: CalendarEvent[] = [];

  addEvent(): void {
    this.events.push({
      color: colors.red,
      draggable: true,
      end: endOfDay(new Date()),
      resizable: {
        afterEnd: true,
        beforeStart: true
      },
      start: startOfDay(new Date()),
      title: ''
    });
    // this.refresh.next();
  }
}