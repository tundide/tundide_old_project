import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'publication-availability',
  styleUrls: ['publication.availability.component.scss'],
  templateUrl: 'publication.availability.component.html'
})
export class PublicationAvailabilityComponent {
  rentType;
  @Output() whatChange = new EventEmitter();

  onTypeClick(typeSelected) {
    this.whatChange.emit(typeSelected);
  }
}