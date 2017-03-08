import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Reservation } from './publication.model';
import { ErrorService } from '../errors/error.service';
import { Observable } from 'rxjs';

/**
 * Manage reservations
 * @module ReservationService
 */
@Injectable()
export class ReservationService {
    /**
     * Event fired when client reserve the publication
     * @event      onReserve.
     */
    @Output() onReserve: EventEmitter<any> = new EventEmitter();

    /**
     * Event fired when client reserve change the publication
     * @event      onReserveChange.
     */
    @Output() onReserveChange: EventEmitter<any> = new EventEmitter();

    constructor(private http: Http, private errorService: ErrorService) {
        this.onReserve = new EventEmitter();
        this.onReserveChange = new EventEmitter();
    }

    /**
     * Reserve publication
     * @param  {Reservation} reservation The reservation object
     */
    reserve(id: string, reservation: Reservation) {
        const body = JSON.stringify(reservation);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.patch('http://localhost:3001/reservation/' + id, body, {headers: headers})
            .map((response: Response) => {
                const result = response.json();
                return result;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }
}