import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PublicationService } from './publication.service';
import { ReservationService } from './reservation.service';
import { SocketService } from '../shared/socket.service';
import { AdvertiserService } from '../advertiser/advertiser.service';
import { ToastyService, ToastyConfig } from 'ng2-toasty';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Publication, Reservation } from './publication.model';
import { CalendarComponent } from '../shared/components/calendar/calendar.component';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
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
  selector: 'view',
  styleUrls: ['publication.view.component.scss'],
  templateUrl: 'publication.view.component.html'
})
export class PublicationViewComponent implements OnInit, OnDestroy  {

  @ViewChild('calendar') calendar: CalendarComponent;
  @ViewChild('confirmaReservation') modal: NgbModal;
  @ViewChild('messageToTheAdvertiser') modalAdvertiser: NgbModal;

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

  events: CalendarEvent[] = [];

  private reservation: Reservation = new Reservation();
  private publicationId: string;
  private publication: Publication;
  private sub: any;
  private message: string;
  private user: User;

  constructor(
    private route: ActivatedRoute,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private location: Location,
    private modalService: NgbModal,
    private advertiserService: AdvertiserService,
    private socketService: SocketService,
    private authService: AuthService,
    private reservationService: ReservationService,
    private publicationService: PublicationService) {

    this.user = this.authService.getUserCredentials();

    this.authService.onUserDataLoad.subscribe((user) => {
        this.user = user;
    });
      this.toastyConfig.theme = 'bootstrap';
    }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.publicationId = params['id'];
    });

    this.reservationService.onReserveChange.subscribe((reservation) => {
      this.reservation = reservation;
    });

    this.publicationService.onPublicationLoad.subscribe((publication) => {
      _.forEach(publication.reservations, (reservation, key) => {
        let startDate = moment(reservation.startDate);
        let endDate = moment(reservation.endDate);
        this.calendar.addEvent({
          actions: this.actions,
          color: (reservation.approved ? colors.green : colors.yellow),
          end: endDate.toDate(),
          start: startDate.toDate(),
          title: '(' + startDate.format('HH:mm') + '-' + endDate.format('HH:mm') + ') ' + reservation.title
        });
      });

      this.publication = publication;
    });

    this.reservationService.onReserve.subscribe((confirm) => {
      this.modalService.open(this.modal, { size: 'lg' }).result.then((result) => {
        if (result) {
          this.reservationService.reserve(this.publicationId, this.reservation)
            .subscribe(data => {
              this.toastyService.success({
              msg: 'Debe aguardar a que la reserva sea aprobada por el anunciante',
              showClose: true,
              theme: 'bootstrap',
              timeout: 5000,
              title: 'Reserva solicitada con exito.'
            });
          });
        }
      });
    });

    this.advertiserService.onContactAdvertiser.subscribe((confirm) => {
      this.modalService.open(this.modalAdvertiser, { size: 'lg' }).result.then((result) => {
        if (result) {

          this.socketService.sendMessage({
            message: this.message,
            toSocketId: this.publication.user
          });

          this.toastyService.success({
            msg: 'El mensaje se envio correctamente al anunciante',
            showClose: true,
            theme: 'bootstrap',
            timeout: 5000,
            title: 'Mensaje enviado con exito.'
          });
        }
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}