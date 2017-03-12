import * as _ from 'lodash';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FileUploadService } from './fileupload.service';

@Component({
    selector: 'file-upload',
    styleUrls: ['fileupload.component.scss'],
    templateUrl: './fileupload.component.html'
})
export class FileUploadComponent {
    @Input()
    files: Array<String>;

    @ViewChild('fileInput') fileInput;

    constructor(public elementRef: ElementRef,
                public fileUploadService: FileUploadService) {
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
            });
    }
}