import { Component, OnInit, ViewChild } from '@angular/core';
import { ReservationService } from '../../publication/reservation.service';
import { CalendarComponent } from '../../shared/components/calendar/calendar.component';
import * as moment from 'moment';
import * as _ from 'lodash';

import {
  CalendarEvent,
  CalendarEventAction
} from 'angular-calendar';

const colors: any = {
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  green: {
    primary: '#51FF68',
    secondary: '#D2FFE9'
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
    selector: 'schedule',
    templateUrl: 'schedule.component.html'
})

export class ScheduleComponent implements OnInit {
    isActive = false;
    showMenu = '';
    @ViewChild('calendar') calendar: CalendarComponent;
    events: CalendarEvent[] = [];

    actions: CalendarEventAction[] = [{
        label: '<i class="fa fa-fw fa-phone"></i>',
        onClick: ({event}: { event: CalendarEvent }): void => {
            alert('De solicito un cambio de horario');
        }
    }, {
        label: '<i class="fa fa-fw fa-times"></i>',
        onClick: ({event}: { event: CalendarEvent }): void => {
            // this.events = this.events.filter(iEvent => iEvent !== event);
            alert('evento clickeado');
        }
    }];

    constructor(private reservationService: ReservationService) { }

    ngOnInit() {
          this.reservationService.list()
            .subscribe(data => {
                    _.forEach(data.obj, (reservation, key) => {
                        let startDate = moment(reservation.startDate);
                        let endDate = moment(reservation.endDate);
                        this.calendar.addEvent({
                            actions: this.actions,
                            color: (reservation.approved ? colors.green : colors.yellow),
                            end: endDate.toDate(),
                            start: startDate.toDate(),
                            title: reservation.shortId + ' - (' + startDate.format('HH:mm') + '-'
                            + endDate.format('HH:mm') + ') ' + reservation.title
                        });
                    });
                },
                err => {// TODO: Corregir el manejo de errores
                    console.log(err);
            });
    };

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