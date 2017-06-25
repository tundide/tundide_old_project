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
            this.reservationService.cancel(event.meta.publication, {'reservation': event.meta.reservation}).subscribe(res => {
                alert('Se cancelo el turno');
            });
        }
    }];

    actionsApproved: CalendarEventAction[] = [{
        label: '<i class="fa fa-fw fa-check"></i>',
        onClick: ({event}: { event: CalendarEvent }): void => {
            this.reservationService.approve(event.meta.publication, {'reservation': event.meta.reservation}).subscribe(res => {
                alert('Se aprobo el turno');
            });
        }
    }, {
        label: '<i class="fa fa-fw fa-times"></i>',
        onClick: ({event}: { event: CalendarEvent }): void => {
            this.reservationService.cancel(event.meta.publication, {'reservation': event.meta.reservation}).subscribe(res => {
                alert('Se cancelo el turno');
            });
        }
    }];

    actionsCanceled: CalendarEventAction[] = [{
        label: '<i class="fa fa-fw fa-check"></i>',
        onClick: ({event}: { event: CalendarEvent }): void => {
            this.reservationService.approve(event.meta.publication, {'reservation': event.meta.reservation}).subscribe(res => {
                alert('Se aprobo el turno');
            });
        }
    }, {
        label: '<i class="fa fa-fw fa-times"></i>',
        onClick: ({event}: { event: CalendarEvent }): void => {
            // this.events = this.events.filter(iEvent => iEvent !== event);
            alert('Se cancelo el turno');
        }
    }];

    constructor(private reservationService: ReservationService) { }

    ngOnInit() {
          this.reservationService.list()
            .subscribe(res => {
                    if (res) {
                        _.forEach(res.data, (reservation, key) => {
                            let startDate = moment(reservation.startDate);
                            let endDate = moment(reservation.endDate);

                            let evento = {
                                        actions: this.actions,
                                        color: colors.green,
                                        end: endDate.toDate(),
                                        meta: {
                                            publication: reservation.publicationId,
                                            reservation: reservation._id
                                        },
                                        start: startDate.toDate(),
                                        title: reservation.shortId + ' - (' + startDate.format('HH:mm') + '-'
                                        + endDate.format('HH:mm') + ') ' + reservation.title
                                    };
                            switch (reservation.status) {
                                case 0:
                                    evento.actions = this.actions;
                                    evento.color = colors.green;
                                    break;
                                case 1:
                                    evento.actions = this.actionsApproved;
                                    evento.color = colors.yellow;
                                    break;
                                case 2:
                                    evento.actions = this.actionsCanceled;
                                    evento.color = colors.red;
                                    break;
                            }

                            this.calendar.addEvent(evento);
                        });
                    }
                });
    }

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