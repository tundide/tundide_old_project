import { Component, OnInit,  OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PublicationService } from './publication.service';
import { ToastyService, ToastyConfig, ToastOptions } from 'ng2-toasty';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'publication-edit',
  styleUrls: ['publication.edit.component.scss'],
  templateUrl: 'publication.edit.component.html'
})
export class PublicationEditComponent implements OnInit, OnDestroy {
  whatType = '';
  private sub: any;

  constructor(
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private route: ActivatedRoute,
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

    this.sub = this.route.params.subscribe(params => {
      this.publicationService.getFromDatabase(params['id']).subscribe(
              data => {
                this.whatType = data.obj._type;
                this.publicationService.saveToStorage(data.obj);
              },
              // error => console.error(error)
          );
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}