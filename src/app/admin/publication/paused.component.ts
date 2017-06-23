import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../../publication/publication.service';
import * as _ from 'lodash';

@Component({
    selector: 'publication-paused',
    templateUrl: 'paused.component.html'
})

export class PublicationPausedComponent implements OnInit {
    private publications = new Array();

    constructor(private publicationService: PublicationService) { }
    ngOnInit() {
        this.publicationService.listUserIntoDatabase(2).subscribe(
            res => {
                if (res) {
                    this.publications = res.data;
                }
            }
        );
    }

    activate(publicationId) {
        this.publicationService.save(publicationId, 1)
            .subscribe(res => {
                _.remove(this.publications, {
                    _id: publicationId
                });
            });
    }
}