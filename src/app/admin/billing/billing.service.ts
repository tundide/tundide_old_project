import { Http, Response, Headers } from '@angular/http';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ErrorService } from '../../errors/error.service';
import { SocketService } from '../../shared/socket.service';

/**
 * Manage billing.
 * @module BillingService
 */
@Injectable()
export class BillingService {
    private host: string = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;

    constructor(public http: Http,
        private errorService: ErrorService
    ) { }

    /**
     * Associate card to customer
     */
    associateCard(cardId: string) {
        let token = localStorage.getItem('token');
        const headers = new Headers({ 'Authorization': token, 'Content-Type': 'application/json' });
        return this.http.post(this.host + '/billing/card/associate/', { 'cardId': cardId }, { headers: headers })
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