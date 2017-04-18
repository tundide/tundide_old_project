import { Injectable } from '@angular/core';
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
    private host: string = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;

    constructor(private http: Http, private errorService: ErrorService) {
    }

    /**
     * Reserve publication
     * @param  {String} id The id of publication
     * @param  {Reservation} reservation The reservation object
     */
    reserve(id: string, reservation: Reservation) {
        const body = JSON.stringify(reservation);
        let token = localStorage.getItem('token');
        const headers = new Headers({'Authorization': token, 'Content-Type': 'application/json'});
        return this.http.patch(this.host + '/reservation/' + id, body, {headers: headers})
            .map((response: Response) => {
                const result = response.json();
                return result;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    /**
     * Approve reservation
     * @param  {String} id The id of publication
     * @param  {Object} reservation The id of reservation
     */
    approve(id: string, reservation: any) {
        const body = JSON.stringify(reservation);
        let token = localStorage.getItem('token');
        const headers = new Headers({'Authorization': token, 'Content-Type': 'application/json'});
        return this.http.patch(this.host + '/reservation/approve/' + id, body, {headers: headers})
            .map((response: Response) => {
                const result = response.json();
                return result;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    /**
     * Cancel reservation
     * @param  {String} id The id of publication
     * @param  {Object} reservation The id of reservation
     */
    cancel(id: string, reservation: any) {
        const body = JSON.stringify(reservation);
        let token = localStorage.getItem('token');
        const headers = new Headers({'Authorization': token, 'Content-Type': 'application/json'});
        return this.http.patch(this.host + '/reservation/cancel/' + id, body, {headers: headers})
            .map((response: Response) => {
                const result = response.json();
                return result;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    /**
     * List all reservations of User
     */
    list() {
        let token = localStorage.getItem('token');
        const headers = new Headers({'Authorization': token, 'Content-Type': 'application/json'});
        return this.http.get(this.host + '/reservation/', {headers: headers})
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