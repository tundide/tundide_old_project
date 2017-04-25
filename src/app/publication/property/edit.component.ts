import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PublicationService } from '../publication.service';
import { Publication } from '../publication.model';
import { MapService } from '../../shared/map.service';
import { LocationService } from '../../shared/location.service';
import { MarkerManager, SebmGoogleMapMarker } from 'angular2-google-maps/core';
import { ToastyService, ToastyConfig } from 'ng2-toasty';
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
  public selectedProvince;
  public selectedLocation;
  public selectedStreet;
  public selectedNumber;
  private lat = 0;
  private lon = 0;



  publicationChange(event) {
    this.change.emit(this.publication);
  }

  markerDragEnd($event: MouseEvent) {
    console.log('dragEnd', $event);
  }

  streetChange(address) {
    this.mapService.getGeocode(this.selectedProvince.description + ' ' +
      this.selectedLocation.description + ' ' +
      '(' + this.selectedLocation.zip + ') ' +
      this.selectedStreet + ' ' +
      this.selectedNumber).subscribe(
      res => {
        if (res.status === 'OK') {
          // this.markerManager.getNativeMarker(el.nativeElement).then(marker => {

          // });
          this.lat = res.results[0].geometry.location.lat;
          this.lon = res.results[0].geometry.location.lng;
          let street = _.find(res.results[0].address_components, function (o: any) {
            return o.types[0] === 'route';
          });
          this.selectedStreet = street.long_name;

          let m = new SebmGoogleMapMarker(this.markerManager);
          m.latitude = this.lat;
          m.longitude = this.lon;
          m.title = 'Ubicacion actual';
          this.markerManager.addMarker(m);
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
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private publicationService: PublicationService,
    private mapService: MapService,
    private locationService: LocationService,
    private markerManager: MarkerManager) {
      this.toastyConfig.theme = 'bootstrap';
  }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((e) => {
      this.lat = e.coords.latitude;
      this.lon = e.coords.longitude;
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