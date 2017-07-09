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

        this.sub = this.route.params.subscribe(params => {
          this.stringBuscado = params['b'];

          this.publicationService.findIntoDatabase(this.stringBuscado).subscribe(
            respub => {

              this.publications = new Array();
              if (respub.status !== 204) {
                _.forEach(respub.body.data, (publication, key) => {
                  if (publication.location.province && publication.location.place) {
                    let prov = _.find(this.provinces, (o: any) => {
                      return o.code === publication.location.province;
                    });
                    if (prov) {
                      let place = _.find(prov.locations, (o: any) => {
                        return o.code === publication.location.place;
                      });

                      publication.location.provinceDescription = prov.description;
                      publication.location.placeDescription = place.description;
                      this.publications.push(publication);
                    }
                  }
                });
              }
            }
          );
        });
      }
    );

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