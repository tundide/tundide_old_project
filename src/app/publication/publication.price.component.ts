import { Component, OnInit } from '@angular/core';
import { PublicationService } from './publication.service';

@Component({
  selector: 'publication-price',
  styleUrls: ['publication.price.component.scss'],
  templateUrl: 'publication.price.component.html'
})
export class PublicationPriceComponent implements OnInit {
  private price: Number = 0;

  constructor(private publicationService: PublicationService) { }

  ngOnInit() {
    this.publicationService.onPublicationChange.subscribe((publication) => {
      this.price = publication.price;
    });
  }

  priceChange() {
    this.publicationService.onPublicationPriceChange.emit(this.price);
  }
}