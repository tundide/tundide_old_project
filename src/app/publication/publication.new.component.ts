import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PublicationService } from './publication.service';
import { ToastyService, ToastyConfig, ToastOptions } from 'ng2-toasty';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Publication } from './publication.model';
import { Property } from './property/property.model';
import { Service } from './service/service.model';
import { WizardComponent } from '../shared/components/wizard/wizard.component';
import { MinImages } from '../shared/customValidators/image.validator';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

declare var $: JQueryStatic;
declare var CKEDITOR;

@Component({
  selector: 'publication',
  styleUrls: ['publication.new.component.scss'],
  templateUrl: 'publication.new.component.html'
})
export class PublicationNewComponent implements OnInit {

  public whatType;
  public publication: Publication;
  public publicationValid: boolean;
  @ViewChild('confirmNewPublicationModal') modal: NgbModal;
  @ViewChild('wizard') wizard: WizardComponent;

  private formNew: FormGroup;

  constructor(
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private publicationService: PublicationService) {
    this.publicationValid = false;
    $.getScript('//cdn.ckeditor.com/4.7.1/basic/ckeditor.js');
    this.toastyConfig.theme = 'bootstrap';
  }

  publicationChange(event) {
    this.publicationService.saveToStorage(this.publication);
  }

  ngOnInit() {
    this.loadValidators();
  }

  /**
   * Load validator for fields of publication
   */
  loadValidators() {
    let provinceControl = this.formBuilder.control('', Validators.required);
    let placeControl = this.formBuilder.control({ disabled: !provinceControl.valid }, Validators.required);


    provinceControl.statusChanges.subscribe((newStatus) => {
      if (provinceControl.valid) {
        placeControl.enable();
      } else {
        placeControl.disable();
      }
    });

    let streetControl = this.formBuilder.control({
      disabled: !provinceControl.valid
      || !placeControl.valid
    }, [Validators.required,
    Validators.minLength(2),
    Validators.maxLength(20)]);

    placeControl.statusChanges.subscribe((newStatus) => {
      if (provinceControl.valid && placeControl.valid) {
        streetControl.enable();
      } else {
        streetControl.disable();
      }
    });

    let numberControl = this.formBuilder.control('', [Validators.required,
    Validators.pattern('[0-9]*'),
    Validators.minLength(2),
    Validators.maxLength(10)]);

    streetControl.statusChanges.subscribe((newStatus) => {
      if (streetControl.valid) {
        numberControl.enable();
      } else {
        numberControl.disable();
      }
    });

    this.formNew = this.formBuilder.group({
      pricegroup: this.formBuilder.group({
        price: this.formBuilder.control('', [Validators.required, Validators.minLength(1)])
      }),
      propertygroup: this.formBuilder.group({
        description: this.formBuilder.control('', [Validators.required]),
        images: this.formBuilder.control('', [MinImages]),
        number: numberControl,
        place: placeControl,
        province: provinceControl,
        street: streetControl,
        title: this.formBuilder.control('', [Validators.required, Validators.minLength(5),
        Validators.maxLength(50)])
      }),
      whatgroup: this.formBuilder.group({ // TODO: Completar para validar que se haya elegido la categoria correctamente
        category: this.formBuilder.control('', [Validators.required])
      })
    });
  }

  /**
   * Remove Publication from localStorage and reinitialize the actual publication
   */
  onResetPublication() {
    this.modalService.open(this.modal).result.then((result) => {
      if (result) {
        this.publicationService.deleteInStorage();

        let whatStep = this.wizard.steps[0];
        this.wizard.goToStep(whatStep);

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
      this.publication = this.publicationService.getFromStorage();

      if (this.publication.type === this.whatType.type) {
        sameType = true;
      }
    }

    if (inStorage && sameType) {
      this.toastyService.info(toastOptions);
    } else {
      switch (this.whatType.type) {
        case 'Property':
          this.publication = new Property();
          break;
        case 'Service':
          this.publication = new Service();
          break;
        case 'Entreteniment':
          this.publication = new Property();
          break;
        case 'Others':
          this.publication = new Property();
          break;
      }
      this.publication.configuration.category = this.whatType.category;
      this.publication.configuration.subcategory = this.whatType.subcategory;
    }
  }

  /**
   * Save publication on database and redirect to view publication
   */
  onStepFinish() {
    let publication = this.publicationService.getFromStorage();
    this.publicationService.saveToDatabase(publication).subscribe(
      res => {
        this.publicationService.deleteInStorage();

        this.router.navigate(['/publication/view', res.data._id]);
      }
    );
  }
  /**
   * Change type of publication
   */
  rentWhatChange(whatType) {
    this.whatType = whatType;
  }
}