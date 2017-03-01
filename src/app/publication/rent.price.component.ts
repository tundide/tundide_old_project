import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'rent-price',
  styleUrls: ['rent.price.component.scss'],
  templateUrl: 'rent.price.component.html'
})
export class RentPriceComponent {
  rentType;
  @Output() whatChange = new EventEmitter();

  onTypeClick(typeSelected) {
    this.whatChange.emit(typeSelected);
  }
}