import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PublicationService } from '../publication.service';
import { Publication } from '../publication.model';
import { MapService } from '../../shared/map.service';
import { LocationService } from '../../shared/location.service';
import { LatLngLiteral, GoogleMapsAPIWrapper, MarkerManager, SebmGoogleMapMarker } from 'angular2-google-maps/core';
import { ToastyService, ToastyConfig } from 'ng2-toasty';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import * as _ from 'lodash';

@Component({
  selector: 'edit-property',
  styleUrls: ['edit.component.scss'],
  templateUrl: 'edit.component.html'
})
export class PropertyEditComponent implements OnInit {
  public starsCount: number;

  @Input()
  public publication: Publication;

  @Output()
  public change: EventEmitter<Publication> = new EventEmitter<Publication>();
  public provinces = [];
  public locations = [];
  public selectedLocation;
  public selectedStreet;
  public selectedNumber;
  private lat = 0;
  private lon = 0;

  searchLocation = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term.length < 2 ? []
        : _.find(this.provinces, (o: any) => {
          return o.code === this.publication.location.province;
        }).locations.filter(v => new RegExp(term, 'gi').test(v.description)).splice(0, 10))

  formatter = (x: { description: string }) => x.description;

  publicationChange(event) {
    this.change.emit(this.publication);
  }

  markerDragEnd($event: any) {
    this.mapService.getGeocodeFromLatLon($event.coords.lat, $event.coords.lng).subscribe(
      res => {
        if (res.status === 'OK') {
          this.lat = res.results[0].geometry.location.lat;
          this.lon = res.results[0].geometry.location.lng;
          let street = _.find(res.results[0].address_components, function (o: any) {
            return o.types[0] === 'route';
          });
          let number = _.find(res.results[0].address_components, function (o: any) {
            return o.types[0] === 'street_number';
          });
          this.selectedStreet = street.long_name;
          this.selectedNumber = number.long_name;
        } else if (res.status === 'ZERO_RESULTS') {
          this.toastyService.warning({
            msg: 'No se encontraron resultados para la direcci&oacute;n indicada',
            showClose: true,
            theme: 'bootstrap',
            timeout: 5000,
            title: 'Direcci&oacute;n no encontrada.'
          });
        }
      });
  }

  positioningMap() {
    let prov = _.find(this.provinces, (o: any) => {
      return o.code === this.publication.location.province;
    });

    this.mapService.getGeocodeFromAddress(prov.description + ' ' +
      this.selectedLocation.description + ' ' +
      '(' + this.selectedLocation.zip + ') ' +
      this.selectedStreet + ' ' +
      this.selectedNumber).subscribe(
      res => {
        if (res.status === 'OK') {
          this.lat = res.results[0].geometry.location.lat;
          this.lon = res.results[0].geometry.location.lng;
          let street = _.find(res.results[0].address_components, function (o: any) {
            return o.types[0] === 'route';
          });
          this.selectedStreet = street.long_name;

          this.toastyService.success({
            msg: 'Direcci&oacute;n encontrada, posicionando en el mapa.',
            showClose: true,
            theme: 'bootstrap',
            timeout: 5000,
            title: 'Direcci&oacute;n encontrada.'
          });
        } else if (res.status === 'ZERO_RESULTS') {
          this.toastyService.warning({
            msg: 'No se encontraron resultados para la direcci&oacute;n indicada',
            showClose: true,
            theme: 'bootstrap',
            timeout: 5000,
            title: 'Direcci&oacute;n no encontrada.'
          });
        }
      }
      );
  }

  constructor(
    private googleMapsWrapper: GoogleMapsAPIWrapper,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private publicationService: PublicationService,
    private mapService: MapService,
    private locationService: LocationService,
    private sebmMarker: SebmGoogleMapMarker,
    private markerManager: MarkerManager) {
    this.toastyConfig.theme = 'bootstrap';
  }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((e) => {
      this.lat = e.coords.latitude;
      this.lon = e.coords.longitude;
    }, (err) => {
      console.log(err);
    });

    this.locationService.list().subscribe(
      res => {
        this.provinces = res.data;
      }
    );

  }
}

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}