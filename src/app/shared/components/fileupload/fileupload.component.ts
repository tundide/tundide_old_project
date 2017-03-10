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
            for (let i = 0; i < fi.files.length; i++) {
                let fileToUpload = fi.files[i];
                this.fileUploadService
                    .upload(fileToUpload)
                    .subscribe(res => {
                        this.files.push(res._id);
                    });
            }
        }
    }

    // TODO: Agregar metodo de borrado y metodo http delete con delete de GridFs
    removeImage(id) {
        for ( let i = this.files.length; i--; ) {
            if ( this.files[i] === id) {
                this.files.splice(i, 1);
                this.fileUploadService
                    .delete(id)
                    .subscribe(res => {
                        // TODO: Ver que mensaje mandar cunado se borra
                        console.log(res);
                    });
                // TODO: Ver el evento
                // this.complete.emit(this.images);
            }
        }
    }
}