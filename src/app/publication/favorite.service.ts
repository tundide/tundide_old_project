import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
// import { Review } from './publication.model';
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
    exists(id: string) {
        let token = localStorage.getItem('token');
        const headers = new Headers({'Authorization': token, 'Content-Type': 'application/json'});
        return this.http.get('http://localhost:3001/favorite/exists/' + id, {headers: headers})
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
     * Save publication as favorite
     * @param  {String} id The id of publication
     */
    save(id: string) {
        const body = JSON.stringify({publicationId: id});
        let token = localStorage.getItem('token');
        const headers = new Headers({'Authorization': token, 'Content-Type': 'application/json'});
        return this.http.patch('http://localhost:3001/favorite', body, {headers: headers})
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
     * Delete publication as favorite
     * @param  {String} id The id of publication
     */
    delete(id: string) {
        let token = localStorage.getItem('token');
        const headers = new Headers({'Authorization': token, 'Content-Type': 'application/json'});
        return this.http.delete('http://localhost:3001/favorite/' + id, {headers: headers})
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