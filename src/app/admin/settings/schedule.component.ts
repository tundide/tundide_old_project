import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastyService, ToastyConfig, ToastOptions } from 'ng2-toasty';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReservationService } from '../../publication/reservation.service';
import { CalendarComponent } from '../../shared/components/calendar/calendar.component';
import * as moment from 'moment';
import * as _ from 'lodash';

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
    public isActive = false;
    public showMenu = '';
    @ViewChild('calendar') calendar: CalendarComponent;
    @ViewChild('changeReservationModal') modal: NgbModal;
    public events: CalendarEvent[] = [];

    public cancelButton = {
        label: '<i class="fa fa-fw fa-times" title="Cancelar turno"></i>',
        onClick: ({ event }: { event: CalendarEvent }): void => {
            this.reservationService.cancel(event.meta.publication, { 'reservation': event.meta.reservation }).subscribe(res => {
                if (event.meta.myPub) {
                    event.actions = [];
                    event.color = colors.red;
                } else {
                    event.actions = [];
                    event.color = colors.red;
                }
                this.toastyService.success({
                    msg: 'Se cancelo el turno solicitado',
                    showClose: true,
                    theme: 'bootstrap',
                    timeout: 5000,
                    title: 'Solicitud de cancelacion de turno.'
                });
            });
        }
    };

    public approveButton = {
        label: '<i class="fa fa-fw fa-check" title="Aprobar turno"></i>',
        onClick: ({ event }: { event: CalendarEvent }): void => {
            if (event.meta.myPub) {
                event.actions = [this.changeReservationButton, this.cancelButton];
                event.color = colors.green;
            } else {
                event.actions = [this.changeReservationButton, this.cancelButton];
                event.color = colors.green;
            }
            this.reservationService.approve(event.meta.publication, { 'reservation': event.meta.reservation }).subscribe(res => {
                this.toastyService.success({
                    msg: 'Se aprobo el turno',
                    showClose: true,
                    theme: 'bootstrap',
                    timeout: 5000,
                    title: 'Solicitud de turno aprobada.'
                });
            });
        }
    };

    public changeReservationButton = {
        label: '<i class="fa fa-fw fa-clock-o" title="Solicitar cambio de horario"></i>',
        onClick: ({ event }: { event: CalendarEvent }): void => {

            this.modalService.open(this.modal).result.then((result) => {
                if (result) {
                    if (event.meta.myPub) {
                        event.actions = [this.changeReservationButton, this.cancelButton];
                        event.color = colors.yellow;
                    } else {
                        event.actions = [this.approveButton, this.cancelButton];
                        event.color = colors.blue;
                    }
                    this.toastyService.success({
                        msg: 'Se solicito el cambio de horario',
                        showClose: true,
                        theme: 'bootstrap',
                        timeout: 5000,
                        title: 'Solicitud de cambio de turno.'
                    });
                }
            });
        }
    };

    constructor(private reservationService: ReservationService,
        private router: Router,
        private toastyService: ToastyService,
        private modalService: NgbModal,
        private toastyConfig: ToastyConfig) {
        this.toastyConfig.theme = 'bootstrap';
    }

    eventClick(event) {
        this.router.navigate(['/view', event.meta.publication]);
    }

    eventTimesChanged(event) {
        this.reservationService.change(event.meta.publication, {
            'endDate': event.end,
            'id': event.meta.reservation,
            'startDate': event.start
        }).subscribe(res => {
            if (res.status === 200) {
                event.actions = [this.changeReservationButton, this.cancelButton];
                event.color = colors.yellow;
                this.toastyService.info({
                    msg: res.data.message,
                    showClose: true,
                    theme: 'bootstrap',
                    timeout: 10000,
                    title: 'Solicitud de cambio de turno generada.'
                });
            }
        });
    }

    ngOnInit() {
        this.reservationService.list()
            .subscribe(res => {
                if (res) {
                    _.forEach(res.data, (reservation, key) => {
                        let startDate = moment(reservation.startDate);
                        let endDate = moment(reservation.endDate);

                        let evento = {
                            actions: [],
                            color: colors.green,
                            draggable: true,
                            end: endDate.toDate(),
                            meta: {
                                myPub: reservation.myPub,
                                publication: reservation.publicationId,
                                reservation: reservation._id
                            },
                            resizable: {
                                afterEnd: true,
                                beforeStart: true
                            },
                            start: startDate.toDate(),
                            title: reservation.shortId + ' - (' + startDate.format('HH:mm') + '-'
                            + endDate.format('HH:mm') + ') ' + reservation.title
                        };
                        switch (reservation.status) {
                            case 0:
                                if (reservation.myPub) {
                                    evento.actions = [this.approveButton, this.changeReservationButton, this.cancelButton];
                                    evento.color = colors.blue;
                                } else {
                                    evento.actions = [this.changeReservationButton, this.cancelButton];
                                    evento.color = colors.yellow;
                                }
                                break;
                            case 1:
                                if (reservation.myPub) {
                                    evento.actions = [this.changeReservationButton, this.cancelButton];
                                    evento.color = colors.green;
                                } else {
                                    evento.actions = [this.changeReservationButton, this.cancelButton];
                                    evento.color = colors.green;
                                }
                                break;
                            case 2:
                                if (reservation.myPub) {
                                    evento.actions = [this.cancelButton];
                                    evento.color = colors.yellow;
                                } else {
                                    evento.actions = [this.approveButton, this.cancelButton];
                                    evento.color = colors.blue;
                                }
                                break;
                            case 3:
                                if (reservation.myPub) {
                                    evento.actions = [this.changeReservationButton, this.cancelButton];
                                    evento.color = colors.green;
                                } else {
                                    evento.actions = [this.changeReservationButton, this.cancelButton];
                                    evento.color = colors.green;
                                }
                                break;
                            case 4:
                                    evento.actions = [];
                                    evento.color = colors.red;
                                    evento.resizable = {
                                        afterEnd: false,
                                        beforeStart: false
                                    };
                                    evento.draggable = false;
                                break;
                            case 5:
                                    evento.actions = [];
                                    evento.color = colors.red;
                                    evento.resizable = {
                                        afterEnd: false,
                                        beforeStart: false
                                    };
                                    evento.draggable = false;
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