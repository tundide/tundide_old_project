import { Component, OnInit } from '@angular/core';
import { PublicationService } from './publication.service';
import { Publication } from './publication.model';

@Component({
  selector: 'publication-price',
  styleUrls: ['publication.price.component.scss'],
  templateUrl: 'publication.price.component.html'
})
export class PublicationPriceComponent implements OnInit {
  private publication: Publication = new Publication(0);

  constructor(private publicationService: PublicationService) { }

  ngOnInit() {
    this.publicationService.onPublicationChange.subscribe((publication) => {
      this.publication = publication;
    });
  }

  priceChange() {
    this.publicationService.onPublicationChange.emit(this.publication);
  }
}