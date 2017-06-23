import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { Publication } from './publication.model';

@Component({
  selector: 'publication-configuration',
  styleUrls: ['publication.configuration.component.scss'],
  templateUrl: 'publication.configuration.component.html'
})
export class PublicationConfigurationComponent {

  @Input()
  public publication: Publication;

  @Output()
  change: EventEmitter<Publication> = new EventEmitter<Publication>();

  publicationChange() {
    this.change.emit(this.publication);
  }
}