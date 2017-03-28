import { Component, OnInit,  OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicationService } from '../publication.service';
import { ReservationService } from '../reservation.service';
import { Property } from './property.model';
import { AuthService } from '../../auth/auth.service';
import { ReviewService } from '../review.service';
import { FavoriteService } from '../favorite.service';

@Component({
  selector: 'view-property',
  styleUrls: ['view.component.scss'],
  templateUrl: 'view.component.html'
})
export class PropertyViewComponent implements OnInit, OnDestroy {

  publicationAverage: any;
  public favoriteAdded: Boolean = false;

  private sub: any;
  private property: Property = new Property();
  private myPublication: Boolean = false;
  private publicationId: string;
  private user;

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private publicationService: PublicationService,
              private reservationService: ReservationService,
              private reviewService: ReviewService,
              private favoriteService: FavoriteService) {
                this.publicationAverage = {
                  like: 0,
                  score: 0
                };
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.user = this.authService.user;

    this.sub = this.route.params.subscribe(params => {
      this.publicationId = params['id'];

      this.publicationService.getFromDatabase(params['id']).subscribe(
              data => {
                this.property = data.obj;
                if (this.authService.user) {
                  this.myPublication = (this.authService.user.id === data.obj.user);
                }

                this.publicationService.onPublicationLoad.emit(data.obj);
              },
              // TODO: Ver el manejo de errores
              // error => console.error(error)
          );

      this.reviewService.getScore(params['id'])
        .subscribe(data => {
          this.publicationAverage = data.obj;
      });

      this.favoriteService.exists(params['id'])
        .subscribe(data => {
          this.favoriteAdded = data.obj;
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onFavoriteChange(added: Boolean) {
    if (added) {
      this.favoriteService.delete(this.publicationId)
        .subscribe(data => {
          this.favoriteAdded = false;
      });
    } else {
      this.favoriteService.save(this.publicationId)
        .subscribe(data => {
          this.favoriteAdded = true;
      });
    }
  }

  onReserve() {
    this.reservationService.onReserve.emit(false);
  }
}