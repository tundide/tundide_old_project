import * as _ from 'lodash';
import { Component, ElementRef, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FileUploadService } from './fileupload.service';

@Component({
    selector: 'file-upload',
    styleUrls: ['fileupload.component.scss'],
    templateUrl: './fileupload.component.html'
})
export class FileUploadComponent {
    @Input()
    files: Array<String>;

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

    constructor(public elementRef: ElementRef,
                public fileUploadService: FileUploadService) {
        this.onUploadComplete = new EventEmitter();
        this.onDeleteComplete = new EventEmitter();
    }

    // TODO: Agregar documentacion
    changeListener($event: any): void {
        let fi = this.fileInput.nativeElement;

        if (fi.files) {
            _.forEach(fi.files, (file, key) => {
                this.fileUploadService
                    .upload(file)
                    .subscribe(res => {
                    this.files.push(res._id);
                    this.onUploadComplete.emit();
                });
            });
        }
    }

    // TODO: Agregar metodo de borrado y metodo http delete con delete de GridFs
    removeImage(id) {
        this.fileUploadService
            .delete(id)
            .subscribe(res => {
                _.remove(this.files, (fileId) => {
                    return fileId === id;
                });
                this.onDeleteComplete.emit();
            });
    }
}