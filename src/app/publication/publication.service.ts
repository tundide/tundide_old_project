import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Publication } from './publication.model';
import { ErrorService } from '../errors/error.service';
import { Observable } from 'rxjs';

/**
 * Manage publication to add / edit or delete
 * @module PublicationService
 */
@Injectable()
export class PublicationService {
    /**
     * Event fired when publication change
     * @event      onPublicationChange.
     */
    @Output() onPublicationChange: EventEmitter<any>;

    /**
     * Event fired when publication price change
     * @event      onPublicationPriceChange.
     */
    @Output() onPublicationPriceChange: EventEmitter<any>;

    /**
     * Event fired when publication load form Database
     * @event      onPublicationLoad.
     */
    @Output() onPublicationLoad: EventEmitter<any>;

    public publication: Publication;

    private host: string = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;

    constructor(private http: Http, private errorService: ErrorService) {
        this.onPublicationChange = new EventEmitter();
        this.onPublicationPriceChange = new EventEmitter();
        this.onPublicationLoad = new EventEmitter();
        this.onPublicationChange.subscribe((publication) => {
            this.publication = publication;
        });
    }

    /**
    * Get publication from localStorage
    * @returns Publication
    */
    getFromStorage(): Publication {
        let pub = localStorage.getItem('publication');
        return JSON.parse(pub);
    }

    /**
    * Save publication in localStorage
    * @param  {Publication} publication The publication object
    */
    saveToStorage(publication: Publication) {
        localStorage.setItem('publication', JSON.stringify(publication));
    }

    /**
    * Delete item 'publication' in localStorage
    */
    deleteInStorage() {
        localStorage.removeItem('publication');
    }

    /**
    * Valid if the item exists in the localStorage
    * @returns {Boolean}
    */
    existsInStorage() {
        let publication = this.getFromStorage();

        if (publication !== null) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Save publication in database
     * @param  {Publication} publication The publication object
     * @returns {Publication} Saved publication
     */
    saveToDatabase(publication: Publication) {
        const body = JSON.stringify(publication);
        let token = localStorage.getItem('token');
        const headers = new Headers({'Authorization': token, 'Content-Type': 'application/json'});
        return this.http.post(this.host + '/publication', body, {headers: headers})
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
     * Update saved publication in database
     * @param  {Publication} publication The publication object
     * @returns {Publication} Saved publication
     */
    updateToDatabase(publication: Publication) {
        const body = JSON.stringify(publication);
        let token = localStorage.getItem('token');
        const headers = new Headers({'Authorization': token, 'Content-Type': 'application/json'});
        return this.http.patch(this.host + '/publication', body, {headers: headers})
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
     * Get publication by Id from database
     * @param  {String} id id of publication
     * @returns {Publication} Saved publication
     */
    getFromDatabase(id: string) {
        let token = localStorage.getItem('token');
        const headers = new Headers({'Authorization': token, 'Content-Type': 'application/json'});
        return this.http.get(this.host + '/publication/' + id, {headers: headers})
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
     * Find publications in database
     * @param  {Publication} publication The publication object
     * @returns {Array.<Publication>} Saved publications
     */
    findIntoDatabase(query: any) {
        let token = localStorage.getItem('token');
        const headers = new Headers({'Authorization': token, 'Content-Type': 'application/json'});

        return this.http.get(this.host + '/publication/find/' + JSON.stringify(query), {headers: headers})
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
     * Find publications in database
     * @param  {Number} status Status of publications (1 - Active / 2 - Paused)
     * @returns {Array.<Publication>} Saved publications
     */
    listUserIntoDatabase(status: number) {
        let token = localStorage.getItem('token');
        const headers = new Headers({'Authorization': token, 'Content-Type': 'application/json'});

        return this.http.get(this.host + '/publication/list/user/' + status, {headers: headers})
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