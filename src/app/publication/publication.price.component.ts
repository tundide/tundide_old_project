import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PublicationService } from './publication.service';
import { Publication } from './publication.model';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'publication-price',
  styleUrls: ['publication.price.component.scss'],
  templateUrl: 'publication.price.component.html'
})
export class PublicationPriceComponent {
  @Input()
  public publication: Publication;

  @Input()
  public priceGroup: FormGroup;

  @Output()
  change: EventEmitter<Publication> = new EventEmitter<Publication>();

  constructor(private publicationService: PublicationService) { }

  priceChange() {
    this.change.emit(this.publication);
  }
}