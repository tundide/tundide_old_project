import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Review } from './publication.model';
import { ErrorService } from '../errors/error.service';
import { Observable } from 'rxjs';

/**
 * Manage reviews
 * @module ReviewService
 */
@Injectable()
export class ReviewService {
    /**
     * Event fired when rate the publication
     * @event      onRateIt.
     */
    @Output() onRateIt: EventEmitter<any> = new EventEmitter();

    private host: string = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;

    constructor(private http: Http, private errorService: ErrorService) {
        this.onRateIt = new EventEmitter();
    }

    /**
     * Get the reviews of the publication
     * @param  {String} id The id of publication
     */
    get(id: string) {
        let token = localStorage.getItem('token');
        const headers = new Headers({'Authorization': token, 'Content-Type': 'application/json'});
        return this.http.get(this.host + '/review/' + id, {headers: headers})
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
     * Get score averge of Publication
     * @param  {String} id The id of publication
     */
    getScore(id: string) {
        let token = localStorage.getItem('token');
        const headers = new Headers({'Authorization': token, 'Content-Type': 'application/json'});
        return this.http.get(this.host + '/review/score/' + id, {headers: headers})
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
     * Rate it the publication
     * @param  {String} id The id of publication
     * @param  {Review} review The review object
     */
    rateit(id: string, review: Review) {
        const body = JSON.stringify(review);
        let token = localStorage.getItem('token');
        const headers = new Headers({'Authorization': token, 'Content-Type': 'application/json'});
        return this.http.patch(this.host + '/review/' + id, body, {headers: headers})
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