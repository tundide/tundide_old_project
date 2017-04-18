import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ReservationService } from './reservation.service';
import { Reservation } from './publication.model';
import * as moment from 'moment';

@Component({
  selector: 'publication-reserve',
  styleUrls: ['publication.reserve.component.scss'],
  templateUrl: 'publication.reserve.component.html'
})
export class PublicationReserveComponent implements OnInit {
  @Input()
  public reservation: Reservation;

  @Output()
  change: EventEmitter<Reservation> = new EventEmitter<Reservation>();


  constructor(private reservationService: ReservationService) {

  }

  ngOnInit() {
    this.reservation.startDate = moment().toDate();
    this.reservation.endDate = moment().add(1, 'hours').toDate();
  }

  reservationChange() {
    this.change.emit(this.reservation);
  }
}