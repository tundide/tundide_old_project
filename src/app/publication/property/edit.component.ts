import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PublicationService } from '../publication.service';
import { Publication } from '../publication.model';

export class Coord {
  static latitude = -34.57563458145137;
  static longitude = -58.541860552587856;

  constructor(lat: number, lon: number) {
    Coord.latitude = lat;
    Coord.longitude = lon;
  }
}

@Component({
  selector: 'edit-property',
  styleUrls: ['edit.component.scss'],
  templateUrl: 'edit.component.html'
})
export class PropertyEditComponent implements OnInit {
  starsCount: number;

  lat = Coord.latitude;
  lon = Coord.longitude;

  @Input()
  public publication: Publication;

  @Output()
  change: EventEmitter<Publication> = new EventEmitter<Publication>();

  publicationChange(event) {
    this.change.emit(this.publication);
  }

  constructor(private publicationService: PublicationService) {
  }

  ngOnInit() {
    // navigator.geolocation.getCurrentPosition(function (pos) {
    //   Coord.latitude = pos.coords.latitude;
    //   Coord.longitude = pos.coords.longitude;
    //   alert(Coord.latitude);
    //   alert(Coord.longitude);
    // }, function (err) {
    //   console.warn(`ERROR(${err.code}): ${err.message}`);
    // });
  }
}