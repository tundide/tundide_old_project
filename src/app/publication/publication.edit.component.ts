import { Component, OnInit,  OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PublicationService } from './publication.service';
import { Publication } from './publication.model';
import { ToastyService, ToastyConfig } from 'ng2-toasty';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private route: ActivatedRoute,
    private router: Router,
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
   * Save changes of the publication on database and redirect to view publication
   */
  onSaveChanges() {
    let publication = this.publicationService.getFromStorage();

    this.publicationService.updateToDatabase(publication).subscribe(
                  res => {
                    this.publicationService.deleteInStorage();

                    this.router.navigate(['/view', res.data._id]);
                  }
              );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}