import { Component, OnInit,  OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicationService } from '../publication.service';
import { Property } from './property.model';

@Component({
  selector: 'view',
  styleUrls: ['view.component.scss'],
  templateUrl: 'view.component.html'
})
export class PropertyViewComponent implements OnInit, OnDestroy {

  starsCount: number;

  images: any[];
  private sub: any;
  private property: Property = new Property();

  constructor(private route: ActivatedRoute, private publicationService: PublicationService) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);

    this.sub = this.route.params.subscribe(params => {
      this.publicationService.getFromDatabase(params['id']).subscribe(
              data => {
                this.property = data.obj;
              },
              // error => console.error(error)
          );
    });

    this.images = [];
    this.images.push({
      alt: 'Vista al sotano pero muy linda',
      source: 'http://www.decoracionia.com/imagenes/oficinas-600x400.jpg', title: 'Amplia Oficina'
    });
    this.images.push({
      alt: 'Paredes blancas muy blancas',
      source: 'http://www.decoracionia.com/imagenes/oficinas-1-600x322.jpg', title: 'Linda Decoracion'
    });
    this.images.push({
      alt: 'Luz natural, (Llega hasta el sotano)',
      source: 'http://www.decoracionia.com/imagenes/oficinas-6-600x391.jpg', title: 'Gran Luminosidad'
    });
    this.images.push({
      alt: '',
      source: 'http://www.decoracionia.com/imagenes/oficinas-7-600x450.jpg', title: ''
    });
    this.images.push({
      alt: '',
      source: 'http://www.decoracionia.com/imagenes/oficinas-4-600x381.jpg', title: ''
    });
    this.images.push({
      alt: '',
      source: 'http://www.decoracionia.com/imagenes/oficinas-8-600x450.jpg', title: ''
    });
    this.images.push({
      alt: '',
      source: 'http://www.decoracionia.com/imagenes/oficinas-9.jpg', title: ''
    });
    this.images.push({
      alt: '',
      source: 'http://www.decoracionia.com/imagenes/oficinas-3-600x348.jpg', title: ''
    });
    this.images.push({
      alt: '',
      source: 'http://www.decoracionia.com/imagenes/oficinas-2-600x400.jpg', title: ''
    });
    this.images.push({
      alt: '',
      source: 'http://www.decoracionia.com/imagenes/oficinas-5-600x400.jpg', title: ''
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}