import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../../publication/publication.service';

@Component({
    selector: 'publication-active',
    templateUrl: 'active.component.html'
})

export class PublicationActiveComponent implements OnInit {
    private publications = new Array();

    constructor(private publicationService: PublicationService) {}
    ngOnInit() {
        this.publicationService.listUserIntoDatabase(1).subscribe(
                data => {
                this.publications = data.obj;
                },
                // error => console.error(error)
            );
    }
}