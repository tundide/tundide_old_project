import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PublicationService } from './publication.service';
import { ReservationService } from './reservation.service';
import { ToastyService, ToastyConfig, ToastOptions } from 'ng2-toasty';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Publication, Reservation } from './publication.model';

@Component({
  selector: 'view',
  styleUrls: ['publication.view.component.scss'],
  templateUrl: 'publication.view.component.html'
})
export class PublicationViewComponent implements OnInit, OnDestroy  {

  @ViewChild('confirmaReservation') modal: NgbModal;

  private publication: Publication = new Publication(0);
  private reservation: Reservation = new Reservation();
  private publicationId: string;
  private sub: any;

  constructor(
    private route: ActivatedRoute,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private router: Router,
    private location: Location,
    private modalService: NgbModal,
    private reservationService: ReservationService,
    private publicationService: PublicationService) {

    this.toastyConfig.theme = 'bootstrap';

    let toastOptions: ToastOptions = {
      msg: 'Se recupero con exito la publicaci&oacute;n',
      showClose: true,
      theme: 'bootstrap',
      timeout: 5000,
      title: 'Publicacion recuperada'
    };

      this.toastyService.success(toastOptions);
  }

  ngOnInit() {
    this.publicationService.getPublicationChangeEvent().subscribe((publication) => {
      this.publication = publication;
    });

    this.sub = this.route.params.subscribe(params => {
      this.publicationId = params['id'];
    });

    this.reservationService.getReserveChangeEvent().subscribe((reservation) => {
      this.reservation = reservation;
    });

    this.reservationService.getReserveEvent().subscribe((confirm) => {
      this.modalService.open(this.modal, { size: 'lg' }).result.then((result) => {
        if (result) {
        this.reservationService.reserve(this.publicationId, this.reservation).subscribe(
              data => {
                      this.toastyService.success({
                      msg: 'Debe aguardar a que la reserva sea aprobada por el anunciante',
                      showClose: true,
                      theme: 'bootstrap',
                      timeout: 5000,
                      title: 'Reserva solicitada con exito.'
                    });
                  });
        }
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}