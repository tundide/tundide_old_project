import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PublicationService } from './publication.service';
import { ToastyService, ToastyConfig, ToastOptions } from 'ng2-toasty';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'view',
  styleUrls: ['view.component.scss'],
  templateUrl: 'view.component.html'
})
export class ViewComponent {

  constructor(
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private router: Router,
    private location: Location,
    private modalService: NgbModal,
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



}