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
        // TODO: Mandar un alerta a todos los que tengan una reserva hecha en esta publicacion
        this.publicationService.save(publicationId, 2)
            .subscribe(res => {
                _.remove(this.publications, {
                    _id: publicationId
                });
            });
    }
}