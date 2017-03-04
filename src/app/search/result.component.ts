import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'result',
  styleUrls: [ 'result.component.scss' ],
  templateUrl: 'result.component.html'
})
export class ResultComponent implements OnInit {
  @Input() publication;

  private imageUrl;
  ngOnInit() {
    // FIXME: Corregir las rutas dinamicas
    if (this.publication.images.length) {
      this.imageUrl = 'http://localhost:3001/files/download/' + this.publication.images[0];
    }else {
      this.imageUrl = 'http://localhost:3001/images/noimagen.png';
    }
  }
}