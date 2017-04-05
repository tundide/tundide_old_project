import { Component, Input, OnInit,  OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicationService } from '../publication.service';
import { ReservationService } from '../reservation.service';
import { Property } from './property.model';
import { AuthService } from '../../auth/auth.service';
import { AdvertiserService } from '../../advertiser/advertiser.service';
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

  @Input()
  public user;

  private sub: any;
  private property: Property = new Property();
  private myPublication: Boolean = false;
  private publicationId: string;

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private advertiserService: AdvertiserService,
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

    this.sub = this.route.params.subscribe(params => {
      this.publicationId = params['id'];

      this.publicationService.getFromDatabase(params['id']).subscribe(
              res => {
                this.property = res.data;
                if (this.user) {
                  this.myPublication = (this.user.shortId === res.data.user.shortId);
                }

                this.publicationService.onPublicationLoad.emit(res.data);
              }
          );

      this.reviewService.getScore(params['id'])
        .subscribe(res => {
          this.publicationAverage = res.data;
      });

      if (this.user) {
        this.favoriteService.exists(params['id'])
                .subscribe(res => {
                  this.favoriteAdded = res.data;
              });
      };
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

  onContactAdvertiser() {
    this.advertiserService.onContactAdvertiser.emit();
  }
}