import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'rent-what',
  styleUrls: ['rent.what.component.scss'],
  templateUrl: 'rent.what.component.html'
})
export class RentWhatComponent {
  rentType;
  @Output() whatChange = new EventEmitter();

  onTypeClick(typeSelected) {
    this.whatChange.emit(typeSelected);
  }
}