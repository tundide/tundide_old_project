import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ErrorService } from '../errors/error.service';
import { Observable } from 'rxjs';

@Injectable()
export class MapService {

    constructor(private http: Http, private errorService: ErrorService) {
    }

    /**
     * Get geocode from street
     * @param  {String} address The address to get geocode
     */
    getGeocode(address) {
        return this.http.get('http://maps.google.com/maps/api/geocode/json?address=' + address, null)
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