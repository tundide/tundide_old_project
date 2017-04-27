import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicationService } from '../publication/publication.service';
import { LocationService } from '../shared/location.service';
import * as _ from 'lodash';

@Component({
  selector: 'search',
  styleUrls: ['search.component.scss'],
  templateUrl: 'search.component.html'
})
export class SearchComponent implements OnInit, OnDestroy {
  stringBuscado: string;

  private lat = 0;
  private lon = 0;
  private sub: any;
  private provinces = [];
  private publications: Array<any>;

  constructor(private route: ActivatedRoute,
    private locationService: LocationService,
    private publicationService: PublicationService) { }

  ngOnInit() {
    this.locationService.list().subscribe(
      res => {
        this.provinces = res.data;
      }
    );

    this.sub = this.route.params.subscribe(params => {
      this.stringBuscado = params['b'];
      let exp = {
        $or: [{ 'title': { '$regex': this.stringBuscado, $options: 'i' } },
        { 'description': { '$regex': this.stringBuscado, $options: 'i' } }]
      };
      this.publicationService.findIntoDatabase(exp).subscribe(
        res => {
          this.publications = new Array();
          _.forEach(res.data, (publication, key) => {
            let prov = _.find(this.provinces, (o: any) => {
              return o.code === publication.location.province;
            });
            let place = _.find(prov.locations, (o: any) => {
              return o.code === publication.location.place;
            });
            publication.location.provinceDescription = prov.description;
            publication.location.placeDescription = place.description;

            this.publications.push(publication);
          });
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