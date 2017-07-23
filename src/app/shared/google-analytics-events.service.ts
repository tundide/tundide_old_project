import {Injectable} from '@angular/core';

@Injectable()
export class GoogleAnalyticsEventsService {

  public emitEvent(eventCategory: string,
                   eventAction: string,
                   eventLabel: string = null,
                   eventValue: number = null) {
    ga('send', 'event', {
      eventAction: eventAction,
      eventCategory: eventCategory,
      eventLabel: eventLabel,
      eventValue: eventValue
    });
  }
}