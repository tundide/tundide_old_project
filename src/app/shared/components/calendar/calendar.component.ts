import { Component, EventEmitter, ChangeDetectionStrategy, ViewChild, Input, Output, TemplateRef } from '@angular/core';
import {
  isSameDay,
  isSameMonth
} from 'date-fns';
import { Subject } from 'rxjs/Subject';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'calendar',
  templateUrl: 'calendar.component.html'
})
export class CalendarComponent {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  @Input('month') month: boolean;
  @Input('week') week: boolean;
  @Input('day') day: boolean;
  @Input('events') events: CalendarEvent[] = [];
  @Output('eventtimechange') eventTimesChanged: EventEmitter<CalendarEvent> = new EventEmitter();
  @Output('eventclick') eventClick: EventEmitter<any> = new EventEmitter();

  locale = 'es';

  @Input('default')
  view = 'day';

  viewDate: Date = new Date();

  modalData: {
    action: string,
    event: CalendarEvent
  };

  refresh: Subject<any> = new Subject();

  activeDayIsOpen = true;

  eventClicked({ event }: { event: CalendarEvent }): void {
    this.eventClick.emit(event);
  }

  eventTimesChangedEvent({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    if (event.start.getTime() !== newStart.getTime() || event.end.getTime() !== newEnd.getTime()) {
      event.start = newStart;
      event.end = newEnd;
      this.refresh.next();
      this.eventTimesChanged.emit(event);
    }
  }

  dayClicked({ date, events }: { date: Date, events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  addEvent(event: CalendarEvent): void {
    this.events.push(event);
    this.refresh.next();
  }

}