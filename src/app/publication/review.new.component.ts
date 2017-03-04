import { Component, OnInit } from '@angular/core';
import { PublicationService } from './publication.service';
import { Publication } from './publication.model';

@Component({
  selector: 'review-new',
  styleUrls: ['review.new.component.scss'],
  templateUrl: 'review.new.component.html'
})
export class ReviewNew implements OnInit {
  private publication: Publication = new Publication(0);

  constructor(private publicationService: PublicationService) { }

  ngOnInit() {
    this.publicationService.getPublicationChangeEvent().subscribe((publication) => {
      this.publication = publication;
    });
  }

  priceChange() {
    this.publicationService.getPublicationChangeEvent().emit(this.publication);
  }
}