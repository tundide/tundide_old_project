import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ReservationService } from './reservation.service';
import { Reservation } from './publication.model';

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
    this.reservation.startDate = new Date();
    this.reservation.endDate = new Date();
  }

  reservationChange() {
    this.change.emit(this.reservation);
  }
}