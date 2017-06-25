import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PublicationService } from './publication.service';
import { ReservationService } from './reservation.service';
import { SocketService } from '../shared/socket.service';
import { AdvertiserService } from '../advertiser/advertiser.service';
import { ReviewService } from './review.service';
import { ToastyService, ToastyConfig } from 'ng2-toasty';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Publication, Reservation } from './publication.model';
import { CalendarComponent } from '../shared/components/calendar/calendar.component';
import { AuthService } from '../auth/auth.service';
import { FavoriteService } from './favorite.service';
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
export class PublicationViewComponent implements OnInit, OnDestroy {

  @ViewChild('calendar') calendar: CalendarComponent;
  @ViewChild('confirmaReservation') modal: NgbModal;
  @ViewChild('messageToTheAdvertiser') modalAdvertiser: NgbModal;

  actions: CalendarEventAction[] = [{
    label: '<i class="fa fa-fw fa-phone"></i>',
    onClick: ({ event }: { event: CalendarEvent }): void => {
      alert('De solicito un cambio de horario');
    }
  }, {
    label: '<i class="fa fa-fw fa-times"></i>',
    onClick: ({ event }: { event: CalendarEvent }): void => {
      // this.events = this.events.filter(iEvent => iEvent !== event);
      alert('evento clickeado');
    }
  }];

  events: CalendarEvent[] = [];

  private reservation: Reservation;
  private publicationId: string;
  private sub: any;
  private message: string;
  private publication: Publication;
  private publicationAverage: any;
  private user: User;
  private favorite: Boolean;

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
    private reviewService: ReviewService,
    private publicationService: PublicationService,
    private favoriteService: FavoriteService) {
    this.user = this.authService.getUserCredentials();

    this.authService.onUserDataLoad.subscribe((user) => {
      this.user = user;
    });

    this.toastyConfig.theme = 'bootstrap';
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.publicationId = params['id'];

      this.publicationService.getFromDatabase(params['id']).subscribe(
        res => {
          this.publication = res.data;

          _.forEach(this.publication.reservations, (reservation, key) => {
            let startDate = moment(reservation.startDate);
            let endDate = moment(reservation.endDate);
            this.events.push({
              actions: this.actions,
              color: (reservation.approved ? colors.green : colors.yellow),
              end: endDate.toDate(),
              meta: {
                publication: this.publication.id,
                reservation: reservation.id
              },
              start: startDate.toDate(),
              title: '(' + startDate.format('HH:mm') + '-' + endDate.format('HH:mm') + ') ' + reservation.title
            });
          });
        }
      );

      if (this.user) {
        this.favoriteService.exists(params['id'])
          .subscribe(res => {
            this.favorite = res.data;
          });
      }

      this.reviewService.getScore(params['id'])
        .subscribe(res => {
          this.publicationAverage = res.data;
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

  favoriteChange(added) {
    if (added) {
      this.favoriteService.delete(this.publicationId)
        .subscribe();
    } else {
      this.favoriteService.save(this.publicationId)
        .subscribe();
    }
  }
  requestReservation() {
    this.reservation = new Reservation();
    this.modalService.open(this.modal, { size: 'lg' }).result.then((result) => {
      if (result) {
        this.reservationService.reserve(this.publicationId, this.reservation)
          .subscribe(data => {
            this.toastyService.success({
              msg: data.message,
              showClose: true,
              theme: 'bootstrap',
              timeout: 5000,
              title: 'Reserva solicitada con exito.'
            });
          });
      }
    });
  }

  changeReservation(event) {
    console.log(this.reservation);
    //   this.reservation = reservation;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}