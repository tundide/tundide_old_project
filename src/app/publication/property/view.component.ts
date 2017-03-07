import { Component, OnInit,  OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicationService } from '../publication.service';
import { ReservationService } from '../reservation.service';
import { Property } from './property.model';
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
  selector: 'view-property',
  styleUrls: ['view.component.scss'],
  templateUrl: 'view.component.html'
})
export class PropertyViewComponent implements OnInit, OnDestroy {

  starsCount: number;
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

  private sub: any;
  private property: Property = new Property();

  constructor(private route: ActivatedRoute,
              private publicationService: PublicationService,
              private reservationService: ReservationService) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);

    this.sub = this.route.params.subscribe(params => {
      this.publicationService.getFromDatabase(params['id']).subscribe(
              data => {
                this.property = data.obj;

                for (let i = 0; i < this.property.reservations.length; i++) {
                  let reservation = this.property.reservations[i];
                  console.log(reservation);
                  this.events.push({
                    actions: this.actions,
                    color: (reservation.approved ? colors.green : colors.yellow),
                    end: reservation.endDate,
                    start: reservation.startDate,
                    title: reservation.title
                  });
                }
              },
              // error => console.error(error)
          );
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onReserve() {
    this.reservationService.getReserveEvent().emit(false);
  }
}