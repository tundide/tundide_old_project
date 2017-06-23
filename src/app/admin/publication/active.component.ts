import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../../publication/publication.service';
import * as _ from 'lodash';

@Component({
    selector: 'publication-active',
    templateUrl: 'active.component.html'
})

export class PublicationActiveComponent implements OnInit {
    private publications = new Array();

    constructor(private publicationService: PublicationService) { }
    ngOnInit() {
        this.publicationService.listUserIntoDatabase(1).subscribe(
            res => {
                if (res) {
                    this.publications = res.data;
                }
            }
        );
    }

    pause(publicationId) {
        this.publicationService.save(publicationId, 2)
            .subscribe(res => {
                _.remove(this.publications, {
                    _id: publicationId
                });
            });
    }
}