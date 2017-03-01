import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicationService } from '../publication/publication.service';

@Component({
  selector: 'search',
  styleUrls: [ 'search.component.scss' ],
  templateUrl: 'search.component.html'
})
export class SearchComponent implements OnInit, OnDestroy {

  stringBuscado: string;
  private sub: any;
  private publications = new Array();

  constructor(private route: ActivatedRoute,
              private publicationService: PublicationService) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.stringBuscado = params['b'];
      this.publicationService.find(params['b']).subscribe(
              data => {
                this.publications = data.obj;
              },
              // error => console.error(error)
          );
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}