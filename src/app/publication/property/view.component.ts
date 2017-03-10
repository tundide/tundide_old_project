import { Component, OnInit,  OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicationService } from '../publication.service';
import { ReservationService } from '../reservation.service';
import { Property } from './property.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'view-property',
  styleUrls: ['view.component.scss'],
  templateUrl: 'view.component.html'
})
export class PropertyViewComponent implements OnInit, OnDestroy {

  starsCount: number;

  private sub: any;
  private property: Property = new Property();
  private myPublication: Boolean = false;

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private publicationService: PublicationService,
              private reservationService: ReservationService) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);

    this.sub = this.route.params.subscribe(params => {
      this.publicationService.getFromDatabase(params['id']).subscribe(
              data => {
                this.property = data.obj;
                if (this.authService.user) {
                  this.myPublication = (this.authService.user.id === data.obj.user);
                }

                this.publicationService.onPublicationLoad.emit(data.obj);
              },
              // TODO: Ver el manejo de errores
              // error => console.error(error)
          );
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onReserve() {
    this.reservationService.onReserve.emit(false);
  }
}