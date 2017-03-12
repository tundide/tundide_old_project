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

    constructor(private http: Http, private errorService: ErrorService) {
        this.onRateIt = new EventEmitter();
    }

    /**
     * Get the reviews of the publication
     * @param  {String} id The id of publication
     */
    get(id: string) {
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.get('http://localhost:3001/review/' + id, {headers: headers})
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
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.get('http://localhost:3001/review/score/' + id, {headers: headers})
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
     * @param  {Review} review The review object
     */
    rateit(id: string, review: Review) {
        const body = JSON.stringify(review);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.patch('http://localhost:3001/review/' + id, body, {headers: headers})
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