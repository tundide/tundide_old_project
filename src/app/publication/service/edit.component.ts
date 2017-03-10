import { Component, OnInit } from '@angular/core';

export class Coord {
  static latitude = -34.57563458145137;
  static longitude = -58.541860552587856;

  constructor(lat: number, lon: number) {
    Coord.latitude = lat;
    Coord.longitude = lon;
  }
}

@Component({
  selector: 'edit-service',
  styleUrls: ['edit.component.scss'],
  templateUrl: 'edit.component.html'
})
export class ServiceEditComponent implements OnInit {
  starsCount: number;

  images: any[];

  lat = Coord.latitude;
  lon = Coord.longitude;

  ngOnInit() {
    // navigator.geolocation.getCurrentPosition(function (pos) {
    //   Coord.latitude = pos.coords.latitude;
    //   Coord.longitude = pos.coords.longitude;
    //   alert(Coord.latitude);
    //   alert(Coord.longitude);
    // }, function (err) {
    //   console.warn(`ERROR(${err.code}): ${err.message}`);
    // });

    this.images = []; // TODO: Eliminar ya que no se usa
  }
}