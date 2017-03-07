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
    @Output() onPublicationChange: EventEmitter<any> = new EventEmitter();

    /**
     * Get publicationChangeEvent
     * @event      onPublicationChange.
     */
    getPublicationChangeEvent() {
        return this.onPublicationChange;
    }

    constructor(private http: Http, private errorService: ErrorService) {
        this.onPublicationChange = new EventEmitter();
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
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3001/publication', body, {headers: headers})
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
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.get('http://localhost:3001/publication/' + id, {headers: headers})
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
        const headers = new Headers({'Content-Type': 'application/json'});

        return this.http.get('http://localhost:3001/publication/find/' + JSON.stringify(query), {headers: headers})
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
        const headers = new Headers({'Content-Type': 'application/json'});

        return this.http.get('http://localhost:3001/publication/list/user/' + status, {headers: headers})
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