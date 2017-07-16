import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as json from './publication.what.component.json';

@Component({
  selector: 'publication-what',
  styleUrls: ['publication.what.component.scss'],
  templateUrl: 'publication.what.component.html'
})
export class PublicationWhatComponent implements OnInit {
  public rentType;
  public publicationTypes = [];
  @Output() whatChange = new EventEmitter();

  ngOnInit() {
    this.publicationTypes = (<any>json);
  }

  onTypeClick(typeSelected) {
    this.whatChange.emit(typeSelected);
  }
}