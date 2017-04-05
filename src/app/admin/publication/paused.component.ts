import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../../publication/publication.service';

@Component({
    selector: 'publication-paused',
    templateUrl: 'paused.component.html'
})

export class PublicationPausedComponent implements OnInit {
    private publications = new Array();

    constructor(private publicationService: PublicationService) {}
    ngOnInit() {
        this.publicationService.listUserIntoDatabase(2).subscribe(
                res => {
                    if (res) {
                        this.publications = res.data;
                    };
                }
            );
    }
}