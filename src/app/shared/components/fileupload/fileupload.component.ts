import { Component, EventEmitter, Output, ElementRef, Input } from '@angular/core';

@Component({
    selector: 'file-upload',
    styleUrls: ['fileupload.component.scss'],
    templateUrl: './fileupload.component.html'
})
export class FileUploadComponent {
    files: Array<string>;
    @Output()
    complete = new EventEmitter();

    @Input()
    images: Array<any>;

    constructor(public elementRef: ElementRef) {
    }

    changeListener($event: any) {
        let self = this;

        for (let i = 0; i < $event.target.files.length; i++) {
            if (self.images.length <= 4) { // FIXME: No funciona el limite de cantidad de archivos
                let file: File = $event.target.files[i];
                let filesize = (file.size / 1024);

                if (filesize <= 500) {
                    let myReader: FileReader = new FileReader();
                    myReader.readAsDataURL(file);

                    myReader.onloadend = function (e: any) {
                        self.images.push({
                            contentType: file.type,
                            file: e.target.result,
                            name: file.name,
                        });
                        self.complete.next(self.images);
                    };
                }else {
                    // FIXME: Cambiar esto y poner un growl
                    alert('Los archivos deben ser menor a 500k');
                }
            }else {
                // FIXME: Cambiar esto y poner un growl y un mejor mensaje
                alert('No se pueden subir mas de 5 archivos');
            }
        }
    }

    removeImage(name) {
        for ( let i = this.images.length; i--; ) {
            if ( this.images[i].name === name) {
                this.images.splice(i, 1);
                this.complete.emit(this.images);
            }
        }
    }
}