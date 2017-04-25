import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { ErrorService } from '../errors/error.service';
import { Observable } from 'rxjs';

@Injectable()
export class LocationService {
private host: string = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;

    constructor(private http: Http, private errorService: ErrorService) {
    }

    /**
     * List all Provinces
     */
    list() {
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.get(this.host + '/location/', {headers: headers})
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