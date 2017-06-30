import * as _ from 'lodash';
import { Component, ElementRef, Input, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'validator',
    styleUrls: ['validator.component.scss'],
    templateUrl: './validator.component.html'
})
export class ValidatorComponent {
    @Input()
    name: String;

    /**
     * Event fired when Upload is Complete
     * @event      onUploadComplete.
     */
    @Output() onUploadComplete: EventEmitter<any> = new EventEmitter();

    /**
     * Event fired where Delete is Complete
     * @event      onDeleteComplete.
     */
    @Output() onDeleteComplete: EventEmitter<any> = new EventEmitter();

    @ViewChild('fileInput') fileInput;

    constructor(public elementRef: ElementRef) {
        this.onUploadComplete = new EventEmitter();
        this.onDeleteComplete = new EventEmitter();
    }

    changeListener($event: any): void {
        let fi = this.fileInput.nativeElement;
    }
}