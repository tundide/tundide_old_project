import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicationService } from '../publication.service';
import { ReservationService } from '../reservation.service';
import { MapService } from '../../shared/map.service';
import { LocationService } from '../../shared/location.service';
import { AuthService } from '../../auth/auth.service';
import { AdvertiserService } from '../../advertiser/advertiser.service';
import { FavoriteService } from '../favorite.service';
import { Property } from './property.model';
import * as _ from 'lodash';

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
  private address: string;

  constructor(private route: ActivatedRoute,
    private authService: AuthService,
    private mapService: MapService,
    private locationService: LocationService,
    private advertiserService: AdvertiserService,
    private publicationService: PublicationService,
    private reservationService: ReservationService,
    private favoriteService: FavoriteService) { }

  ngOnInit() {
    window.scrollTo(0, 0);

    if (this.user) {
      this.myPublication = (this.user.id === this.property.user);
    }

    this.locationService.list().subscribe(
      res => {
        let prov = _.find(res.data, (o: any) => {
          return o.code === this.property.location.province;
        });
        this.property.location.provinceDescription = prov.description;
        let place = _.find(prov.locations, (o: any) => {
          return o.code === this.property.location.place;
        });
        this.property.location.placeDescription = place.description;
      }
    );
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