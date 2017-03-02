import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PublicationService } from './publication.service';
import { ToastyService, ToastyConfig, ToastOptions } from 'ng2-toasty';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WizardComponent } from 'ng2-archwizard/dist';
import { Property } from './property/property.model';
import { Service } from './service/service.model';

@Component({
  selector: 'publication',
  styleUrls: ['publication.new.component.scss'],
  templateUrl: 'publication.new.component.html'
})
export class PublicationNewComponent {

  whatType = 1;
  typeSelected = '';

  @ViewChild('confirmNewPublicationModal') modal: NgbModal;

  @ViewChild('wizard') wizard: WizardComponent;

  constructor(
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private router: Router,
    private location: Location,
    private modalService: NgbModal,
    private publicationService: PublicationService) {

    this.toastyConfig.theme = 'bootstrap';

    this.publicationService.getPublicationChangeEvent().subscribe((publication) => {
      this.publicationService.saveToStorage(publication);
    });
  }

  /**
   * Remove Publication from localStorage and reinitialize the actual publication
   */
  onResetPublication() {
    this.modalService.open(this.modal).result.then((result) => {
      if (result) {
        this.wizard.goToStep(0);
        this.publicationService.deleteInStorage();
        this.router.navigate(['/publication']);

        this.toastyService.success({
          msg: 'Perfecto, empecemos de nuevo',
          showClose: true,
          theme: 'bootstrap',
          timeout: 5000,
          title: 'Publicacion eliminada.'
        });
      }
    });
  }

  /**
   * After select 'What' publish, this method redirect to selected Type of publication
   */
  onStepWhat() {
    let toastOptions: ToastOptions = {
      msg: 'Se recupero una publicaci&oacute;n que fue iniciada anteriormente.<br /><br /> ',
      showClose: true,
      theme: 'bootstrap',
      timeout: 5000,
      title: 'Publicacion recuperada'
    };

    let sameType = false;
    let inStorage = false;
    if (this.publicationService.existsInStorage()) {
      inStorage = true;
      let pub = this.publicationService.getFromStorage();
      if (pub.type === this.whatType) {
        sameType = true;
      }
    }

    if (inStorage && sameType) {
      this.toastyService.info(toastOptions);
    }

    let typeOfPublication;
    switch (this.whatType) {
      case 1:
        this.typeSelected = 'Property';
        typeOfPublication = new Property();
        break;
      case 2:
        typeOfPublication = new Service();
        break;
      case 3:
        typeOfPublication = new Property();
        break;
      case 4:
        typeOfPublication = new Property();
        break;
    }

    if (!inStorage || !sameType) {
      this.publicationService.saveToStorage(typeOfPublication);
    }
  }

  /**
   * Save publication on database and redirect to view publication
   */
  onStepFinish() {
    let publication = this.publicationService.getFromStorage();
    this.publicationService.saveToDatabase(publication).subscribe(
                  data => {
                    this.publicationService.deleteInStorage();

                    this.router.navigate(['/view', data.obj._id]);
                  },
                  // error => console.error(error)
              );
  }
  /**
   * Change type of publication
   */
  rentWhatChange(value) {
    this.whatType = value;
  }
}