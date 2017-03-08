import { Component, OnInit } from '@angular/core';
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

  private publication: Publication;

  publicationChange() {
    this.publicationService.onPublicationChange.emit(this.publication);
  }

  constructor(private publicationService: PublicationService) {
    this.publication = this.publicationService.getFromStorage();
  }

  ngOnInit() {
    this.publicationService.onPublicationChange.subscribe((publication) => {
      this.publication = publication;
    });
    // navigator.geolocation.getCurrentPosition(function (pos) {
    //   Coord.latitude = pos.coords.latitude;
    //   Coord.longitude = pos.coords.longitude;
    //   alert(Coord.latitude);
    //   alert(Coord.longitude);
    // }, function (err) {
    //   console.warn(`ERROR(${err.code}): ${err.message}`);
    // });
  }

  /**
  * Upload image to the Publication
  * @param  {string} event Event of the fileUpload with 'serverResponse' property
  */
  imageUploaded(event) {
    this.publication.images.push(JSON.parse(event.serverResponse)._id);
    this.publicationService.onPublicationChange.emit(this.publication);
  }

  /**
  * Remove image from the Publication
  * @param  {string} id Id of the image to remove
  */
  imageRemoved(id) {
    this.publication.images.splice(this.publication.images.indexOf(id), 1);
    this.publicationService.onPublicationChange.emit(this.publication);
  }
}