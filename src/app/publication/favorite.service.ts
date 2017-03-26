import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Review } from './publication.model';
import { ErrorService } from '../errors/error.service';
import { Observable } from 'rxjs';

/**
 * Manage favorites
 * @module FavoriteService
 */
@Injectable()
export class FavoriteService {
    /**
     * Event fired when add publicatino to favorites
     * @event      onFavoriteAdd.
     */
    @Output() onFavoriteAdd: EventEmitter<any> = new EventEmitter();

    constructor(private http: Http, private errorService: ErrorService) {
        this.onFavoriteAdd = new EventEmitter();
    }

    /**
     * Get the reviews of the publication
     * @param  {String} id The id of publication
     */
    get(id: string) {
        let token = localStorage.getItem('token');
        const headers = new Headers({'Authorization': token, 'Content-Type': 'application/json'});
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
     * Get favorite averge of Publication
     * @param  {String} id The id of publication
     */
    getFavorite(id: string) {
        let token = localStorage.getItem('token');
        const headers = new Headers({'Authorization': token, 'Content-Type': 'application/json'});
        return this.http.get('http://localhost:3001/favorite/' + id, {headers: headers})
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
    saveFavorite(id: string) {
        const body = JSON.stringify(review);
        let token = localStorage.getItem('token');
        const headers = new Headers({'Authorization': token, 'Content-Type': 'application/json'});
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