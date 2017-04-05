import { Output, EventEmitter } from '@angular/core';

import { Error } from './error.model';

export class ErrorService {
    @Output() errorOccurred = new EventEmitter<Error>();

    handleError(error: any) {
        const errorData = new Error(error.message);
        this.errorOccurred.emit(errorData);
    }
}