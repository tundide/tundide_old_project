import { Http, Response, Headers } from '@angular/http';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ErrorService } from '../errors/error.service';
import { SocketService } from '../shared/socket.service';

/**
 * Manage advertiser.
 * @module AdvertiserService
 */
@Injectable()
export class AdvertiserService {
    /**
     * Event fired when the client wants to advertise to the advertiser
     * @event      onContactAdvertiser.
     */
    @Output() onContactAdvertiser: EventEmitter<any> = new EventEmitter();

    private socketService: SocketService;
    private host: string = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;

    constructor(public http: Http,
                private errorService: ErrorService
                ) {
                    this.onContactAdvertiser = new EventEmitter();

                    this.socketService = new SocketService();
                }

    /**
     * Send Messageto the advertiser
     */
    sendMessage(message: string) {
        let token = localStorage.getItem('token');
        const headers = new Headers({'Authorization': token, 'Content-Type': 'application/json'});
        return this.http.patch(this.host + '/message/', {}, {headers: headers})
            .map((response: Response) => {

                this.socketService.socket.emit('create', 'crear mensaje');

                return response;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }
}