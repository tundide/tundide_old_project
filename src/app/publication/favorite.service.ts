import { Injectable } from '@angular/core';
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
    private host: string = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;

    constructor(private http: Http, private errorService: ErrorService) {
    }

    /**
     * Get the reviews of the publication
     * @param  {String} id The id of publication
     */
    get() {
        let token = localStorage.getItem('token');
        const headers = new Headers({'Authorization': token, 'Content-Type': 'application/json'});
        return this.http.get(this.host + '/favorite/', {headers: headers})
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
     * Get the reviews of the publication
     * @param  {String} id The id of publication
     */
    exists(id: string) {
        let token = localStorage.getItem('token');
        const headers = new Headers({'Authorization': token, 'Content-Type': 'application/json'});
        return this.http.get(this.host + '/favorite/exists/' + id, {headers: headers})
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
        return this.http.patch(this.host + '/favorite', body, {headers: headers})
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
        return this.http.delete(this.host + '/favorite/' + id, {headers: headers})
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