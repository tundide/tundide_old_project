import { Component, OnInit,  OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicationService } from '../publication.service';
import { ReservationService } from '../reservation.service';
import { Property } from './property.model';

@Component({
  selector: 'view-property',
  styleUrls: ['view.component.scss'],
  templateUrl: 'view.component.html'
})
export class PropertyViewComponent implements OnInit, OnDestroy {

  starsCount: number;

  private sub: any;
  private property: Property = new Property();

  constructor(private route: ActivatedRoute,
              private publicationService: PublicationService,
              private reservationService: ReservationService) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);

    this.sub = this.route.params.subscribe(params => {
      this.publicationService.getFromDatabase(params['id']).subscribe(
              data => {
                this.property = data.obj;
                this.publicationService.getPublicationLoadEvent().emit(data.obj);
              },
              // error => console.error(error)
          );
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onReserve() {
    this.reservationService.getReserveEvent().emit(false);
  }
}