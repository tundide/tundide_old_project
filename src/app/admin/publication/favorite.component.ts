import { Component, OnInit } from '@angular/core';
import { FavoriteService } from '../../publication/favorite.service';

@Component({
    selector: 'publication-favorite',
    templateUrl: 'favorite.component.html'
})

export class PublicationFavoriteComponent implements OnInit {
    private publications = new Array();

    constructor(private favoriteService: FavoriteService) {}
    ngOnInit() {
        this.favoriteService.get().subscribe(
                res => {
                    if (res) {
                        this.publications = res.data;
                    }
                }
            );
    }
}