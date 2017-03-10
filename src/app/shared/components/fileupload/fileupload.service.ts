import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ErrorService } from '../../../errors/error.service';
import { Observable } from 'rxjs';

/**
 * Manage FileUploads
 * @module FileUploadService
 */
@Injectable()
export class FileUploadService {
    /**
     * Event fired Upload is Complete
     * @event      onUploadComplete.
     */
    @Output() onUploadComplete: EventEmitter<any> = new EventEmitter();

    constructor(private http: Http,
                private errorService: ErrorService) {
        this.onUploadComplete = new EventEmitter();
    }

    // TODO: Corregir documentacion
    /**
     * Upload file to database
     * @param  {Form} fileToUpload The file to upload to database
     */
    upload(fileToUpload: any) {
        let input = new FormData();
        input.append('file', fileToUpload);

        return this.http
            .post('/files/upload', input)
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
     * Delete file to database
     * @param  {String} id The Id of the file
     */
    delete(id: string) {
        return this.http
            .delete('/files/delete/' + name)
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