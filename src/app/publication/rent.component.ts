import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PublicationService } from './publication.service';
import { Publication } from './publication.model';
import { ToastyService, ToastyConfig, ToastOptions } from 'ng2-toasty';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WizardComponent } from 'ng2-archwizard/dist';

@Component({
  selector: 'rent',
  styleUrls: ['rent.component.scss'],
  templateUrl: 'rent.component.html'
})
export class RentComponent {

  whatType = 1;
  publication: Publication;

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

  }

  /**
   * Remove LocalStorage and reinitialize the actual publication
   */
  onResetPublication() {
    this.modalService.open(this.modal).result.then((result) => {
      if (result) {
        this.wizard.goToStep(0);
        this.publicationService.storage.clean();
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

    if (this.publicationService.storage.exists()) {
      this.toastyService.info(toastOptions);
    }

    switch (this.whatType) {
      case 1:
        this.router.navigate(['/publication/property/edit']);
        break;
      case 2:
        this.router.navigate(['/publication/services/edit']);
        break;
      case 3:
        this.router.navigate(['/publication/entreteinment/edit']);
        break;
      case 4:
        this.router.navigate(['/publication/others/edit']);
        break;
    }

    this.publicationService.storage.initialize(this.whatType);
  }

  /**
   * Save publication on database and redirect to view publication
   */
  onStepFinish() {
    let publication = this.publicationService.storage.get();
    this.publicationService.save(publication).subscribe(
                  data => {
                    this.publicationService.storage.clean();
                    console.log(data.obj._id);
                    this.router.navigate(['/view/property', data.obj._id]);
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