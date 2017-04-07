import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicationService } from '../publication.service';
import { ReservationService } from '../reservation.service';
import { AuthService } from '../../auth/auth.service';
import { AdvertiserService } from '../../advertiser/advertiser.service';
import { FavoriteService } from '../favorite.service';
import { Property } from './property.model';

@Component({
  selector: 'view-property',
  styleUrls: ['view.component.scss'],
  templateUrl: 'view.component.html'
})
export class PropertyViewComponent implements OnInit {

  @Input()
  public favorite: Boolean = false;
  @Input()
  public user;
  @Input()
  public property: Property;
  @Input()
  publicationAverage: any;

  @Output()
  onRequestReservation: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  onFavoriteChange: EventEmitter<any> = new EventEmitter<any>();

  private myPublication: Boolean = false;

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private advertiserService: AdvertiserService,
              private publicationService: PublicationService,
              private reservationService: ReservationService,
              private favoriteService: FavoriteService) {}

  ngOnInit() {
    window.scrollTo(0, 0);

    if (this.user) {
      this.myPublication = (this.user.id === this.property.user);
    }
  }

  favoriteChange(added: Boolean) {
    this.favorite = !added;
    this.onFavoriteChange.emit(added);
  }

  Reserve() {
    this.onRequestReservation.emit(false);
  }

  onContactAdvertiser() {
    this.advertiserService.onContactAdvertiser.emit();
  }
}