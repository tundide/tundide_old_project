import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Publication, PublicationType } from './publication.model';
import { Property } from './property/property.model';
import { ErrorService } from '../errors/error.service';
import { Observable } from 'rxjs';

/**
 * Manage publication to add / edit or delete
 * @module PublicationService
 */
@Injectable()
export class PublicationService {
    /**
     * Functions to access to localStorage information.
     * @property storage
     */
    storage = {
        /**
         * Get publication from localStorage
         * @returns Publication
         */
        get(): Publication {
            let pub = localStorage.getItem('publication');
            return JSON.parse(pub);
        },

        /**
         * Initialize publication in localStorage
         * @param  {PublicationType} type Type of publication you want to star
         * (1 - Property / 2 - Services / 3 - Entreteinment / 4 - Others)
         */
        initialize(type: PublicationType) {
            let publication = this.get();
            let inStorage = false;
            let differentType = false;

            if (publication !== null) {
                inStorage = true;

                if (publication.type !== type) {
                    differentType = true;
                }
            } else {
                inStorage = false;
            }

            if (!inStorage || differentType) {
                publication = new Property();
                localStorage.setItem('publication', JSON.stringify(publication));
            }
        },

        /**
         * Save publication in localStorage
         * @param  {Publication} publication The publication object
         */
        save(publication: Publication) {
            localStorage.setItem('publication', JSON.stringify(publication));
        },

        /**
         * Clean publication from localStorage
         */
        clean() {
            localStorage.removeItem('publication');
        },

        /**
         * Valid if the item exists in the localStorage
         * @returns {Boolean}
         */
        exists() {
            let publication = this.get();

            if (publication !== null) {
                return true;
            } else {
                return false;
            }
        }
    };

    constructor(private http: Http, private errorService: ErrorService) {
    }


    /**
     * Save publication in database
     * @param  {Publication} publication The publication object
     * @returns {Publication} Saved publication
     */
    save(publication: Publication) {
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
    get(id: string) {
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
     * Save publication in database
     * @param  {Publication} publication The publication object
     * @returns {Publication} Saved publication
     */
    find(query: string) {
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.get('http://localhost:3001/publication/query/' + query, {headers: headers})
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