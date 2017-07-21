import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PublicationService } from './publication.service';
import { Publication } from './publication.model';
import { ToastyService, ToastyConfig } from 'ng2-toasty';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MinImages } from '../shared/customValidators/image.validator';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'publication-edit',
  styleUrls: ['publication.edit.component.scss'],
  templateUrl: 'publication.edit.component.html'
})
export class PublicationEditComponent implements OnInit, OnDestroy {
  whatType = '';
  private sub: any;
  private publication: Publication;
  private changeDetected = false;
  private formEdit: FormGroup;

  constructor(
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private location: Location,
    private modalService: NgbModal,
    private publicationService: PublicationService) {
    // Si cambia algo de la publicacion tengo que actualizar el modelo local
  }

  publicationChange(event) {
    this.publicationService.saveToStorage(this.publication);
    this.changeDetected = true;
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    $.getScript('//cdn.ckeditor.com/4.7.1/basic/ckeditor.js');

    this.loadValidators();
    this.sub = this.route.params.subscribe(params => {

      this.publicationService.getFromDatabase(params['id']).subscribe(
        res => {
          this.whatType = res.data._type;
          this.publication = res.data;
        }
      );
    });
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

    this.formEdit = this.formBuilder.group({
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
      })
    });
  }


  /**
   * Save changes of the publication on database and redirect to view publication
   */
  onSaveChanges() {
    let publication = this.publicationService.getFromStorage();

    this.publicationService.updateToDatabase(publication).subscribe(
      res => {
        this.publicationService.deleteInStorage();

        this.router.navigate(['/publication/view', res.data._id]);
      }
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}