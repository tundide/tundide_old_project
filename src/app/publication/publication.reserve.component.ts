import { Component } from '@angular/core';
import { ReservationService } from './reservation.service';
import { Reservation } from './publication.model';

@Component({
  selector: 'publication-reserve',
  styleUrls: ['publication.reserve.component.scss'],
  templateUrl: 'publication.reserve.component.html'
})
export class PublicationReserveComponent {

  private reservation: Reservation;

  constructor(private reservationService: ReservationService) {
    this.reservation = new Reservation();
    this.reservation.startDate = new Date();
    this.reservation.endDate = new Date();
  }

  reservationChange() {
    this.reservationService.getReserveChangeEvent().emit(this.reservation);
  }
}