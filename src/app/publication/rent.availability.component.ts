import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'rent-availability',
  styleUrls: ['rent.availability.component.scss'],
  templateUrl: 'rent.availability.component.html'
})
export class RentAvailabilityComponent {
  rentType;
  @Output() whatChange = new EventEmitter();

  onTypeClick(typeSelected) {
    this.whatChange.emit(typeSelected);
  }
}