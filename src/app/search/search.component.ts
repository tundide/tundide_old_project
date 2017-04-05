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
      let exp = {$or: [{'title': {'$regex': this.stringBuscado, $options: 'i'}},
                      {'description': {'$regex': this.stringBuscado, $options: 'i'}}]};
      this.publicationService.findIntoDatabase(exp).subscribe(
              res => {
                this.publications = res.data;
              }
          );
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}