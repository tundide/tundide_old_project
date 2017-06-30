import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PublicationService } from '../publication.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Property } from './property.model';
import { MapService } from '../../shared/map.service';
import { LocationService } from '../../shared/location.service';
import { LatLngLiteral, GoogleMapsAPIWrapper, MarkerManager, SebmGoogleMapMarker } from 'angular2-google-maps/core';
import { ToastyService, ToastyConfig } from 'ng2-toasty';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import * as _ from 'lodash';
import { ValidationExtensions } from 'ng2-mdf-validation-messages';

@Component({
    selector: 'edit-property',
    styleUrls: ['edit.component.scss'],
    templateUrl: 'edit.component.html'
})
export class PropertyEditComponent implements OnInit {
    public starsCount: number;

    @Input()
    public publication: Property;

    @Input()
    public propertyGroup: FormGroup;

    @Output()
    public change: EventEmitter<Property> = new EventEmitter<Property>();
    @Output()
    public status: EventEmitter<Boolean> = new EventEmitter<Boolean>();
    public provinces = [];
    public locations = [];
    public selectedPlace: any;

    private title: FormControl;
    private description: FormControl;
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

    placeChange(event) {
        this.publication.location.place = event.item.code;
    }

    markerDragEnd($event: any) {
        this.mapService.getGeocodeFromLatLon($event.coords.lat, $event.coords.lng).subscribe(
            res => {
                if (res.status === 'OK') {
                    this.publication.location.latitude = res.results[0].geometry.location.lat;
                    this.publication.location.longitude = res.results[0].geometry.location.lng;
                    let street = _.find(res.results[0].address_components, function (o: any) {
                        return o.types[0] === 'route';
                    });
                    let number = _.find(res.results[0].address_components, function (o: any) {
                        return o.types[0] === 'street_number';
                    });
                    this.publication.location.street = street.long_name;
                    this.publication.location.number = number.long_name;
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

        let place = _.find(prov.locations, (o: any) => {
            return o.code === this.publication.location.place;
        });

        this.mapService.getGeocodeFromAddress(prov.description + ' ' +
            place.description + ' ' +
            '(' + place.zip + ') ' +
            this.publication.location.street + ' ' +
            this.publication.location.number).subscribe(
            res => {
                if (res.status === 'OK') {
                    this.publication.location.latitude = res.results[0].geometry.location.lat;
                    this.publication.location.longitude = res.results[0].geometry.location.lng;
                    let street = _.find(res.results[0].address_components, function (o: any) {
                        return o.types[0] === 'route';
                    });
                    this.publication.location.street = street.long_name;

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

        // let provinceControl = fb.control('', Validators.required);
        // let placeControl = fb.control({ disabled: !provinceControl.valid }, Validators.required);


        // provinceControl.statusChanges.subscribe((newStatus) => {
        //     if (provinceControl.valid) {
        //         placeControl.enable();
        //     } else {
        //         placeControl.disable();
        //     }
        // });

        // let streetControl = fb.control({
        //     disabled: !provinceControl.valid
        //     || !placeControl.valid
        // }, [Validators.required,
        // Validators.minLength(2),
        // Validators.maxLength(10)]);

        // placeControl.statusChanges.subscribe((newStatus) => {
        //     if (provinceControl.valid && placeControl.valid) {
        //         streetControl.enable();
        //     } else {
        //         streetControl.disable();
        //     }
        // });

        // let numberControl = fb.control([{
        //     disabled: !streetControl.valid
        // }, Validators.required,
        // Validators.minLength(2),
        // Validators.maxLength(10)]);

        // streetControl.statusChanges.subscribe((newStatus) => {
        //     if (streetControl.valid) {
        //         numberControl.enable();
        //     } else {
        //         numberControl.disable();
        //     }
        // });

        // this.title = this.fb.control('', [ValidationExtensions.required(),
        // ValidationExtensions.minLength(10),
        // ValidationExtensions.maxLength(50)]);

        // this.description = this.fb.control('', [ValidationExtensions.required()]);
        // this.propertyForm = fb.group({
        //     description: this.description,
        //     number: numberControl,
        //     place: placeControl,
        //     province: provinceControl,
        //     street: streetControl,
        //     title: this.title
        // });
    }

    ngOnInit() {
        // this.propertyForm.statusChanges.subscribe((newStatus) => {
        //     this.status.emit(this.propertyForm.valid);
        // });
        this.locationService.list().subscribe(
            res => {
                this.provinces = res.data;

                if (this.publication.location.province) {
                    let prov = _.find(this.provinces, (o: any) => {
                        return o.code === this.publication.location.province;
                    });
                    this.selectedPlace = _.find(prov.locations, (o: any) => {
                        return o.code === this.publication.location.place;
                    });

                    this.positioningMap();
                } else {
                    navigator.geolocation.getCurrentPosition((e) => {
                        this.publication.location.latitude = e.coords.latitude;
                        this.publication.location.longitude = e.coords.longitude;
                    }, (err) => {
                        console.log(err);
                    });
                }
            }
        );
    }
}