import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicationService } from '../publication/publication.service';
import { LocationService } from '../shared/location.service';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'search',
  styleUrls: ['search.component.scss'],
  templateUrl: 'search.component.html'
})
export class SearchComponent implements OnInit, OnDestroy {
  public busy: Subscription;
  stringBuscado: string;

  private lat = 0;
  private lon = 0;
  private sub: any;
  private provinces = [];
  private publications = [];

  constructor(private route: ActivatedRoute,
    private locationService: LocationService,
    private publicationService: PublicationService) { }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.stringBuscado = params['b'];
      this.busy = this.publicationService.findIntoDatabase(this.stringBuscado).subscribe(
        res => {
          if (res.body) {
            this.publications = res.body.data;
          }
        }
      );
    });

    navigator.geolocation.getCurrentPosition((e) => {
      this.lat = e.coords.latitude;
      this.lon = e.coords.longitude;
    }, (e) => {
      console.log(e);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}