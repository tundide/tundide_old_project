import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'view',
  styleUrls: ['view.component.scss'],
  templateUrl: 'view.component.html'
})
export class ServiceViewComponent implements OnInit {
  starsCount: number;

  images: any[];

  ngOnInit() {
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
}