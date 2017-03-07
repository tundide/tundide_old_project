import { Component, ChangeDetectionStrategy, ViewChild, Input, TemplateRef } from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs/Subject';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';

const colors: any = {
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'calendar',
  templateUrl: 'calendar.component.html'
})
export class CalendarComponent {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  @Input('month') month: boolean;
  @Input('week') week: boolean;
  @Input('day') day: boolean;

  locale = 'es';

  @Input('default')
  view = 'month';

  viewDate: Date = new Date();

  modalData: {
    action: string,
    event: CalendarEvent
  };

  actions: CalendarEventAction[] = [{
    label: '<i class="fa fa-fw fa-pencil"></i>',
    onClick: ({event}: { event: CalendarEvent }): void => {
      this.handleEvent('Edited', event);
    }
  }, {
    label: '<i class="fa fa-fw fa-times"></i>',
    onClick: ({event}: { event: CalendarEvent }): void => {
      this.events = this.events.filter(iEvent => iEvent !== event);
      this.handleEvent('Deleted', event);
    }
  }];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [{
    actions: this.actions,
    color: colors.red,
    end: addDays(new Date(), 1),
    start: subDays(startOfDay(new Date()), 1),
    title: 'A 3 day event',
  }, {
    actions: this.actions,
    color: colors.yellow,
    start: startOfDay(new Date()),
    title: 'An event with no end date',
  }, {
    color: colors.blue,
    end: addDays(endOfMonth(new Date()), 3),
    start: subDays(endOfMonth(new Date()), 3),
    title: 'A long event that spans 2 months'
  }, {
    actions: this.actions,
    color: colors.yellow,
    draggable: true,
    end: new Date(),
    resizable: {
      afterEnd: true,
      beforeStart: true
    },
    start: addHours(startOfDay(new Date()), 2),
    title: 'A draggable and resizable event'
  }];

  activeDayIsOpen = true;

  dayClicked({date, events}: { date: Date, events: CalendarEvent[] }): void {

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

  eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    // this.modal.open(this.modalContent, {size: 'lg'});
  }

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
      title: 'New event'
    });
    this.refresh.next();
  }

}