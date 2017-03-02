import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'publication-what',
  styleUrls: ['publication.what.component.scss'],
  templateUrl: 'publication.what.component.html'
})
export class PublicationWhatComponent {
  rentType;
  @Output() whatChange = new EventEmitter();

  onTypeClick(typeSelected) {
    this.whatChange.emit(typeSelected);
  }
}