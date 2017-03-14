import { Component, Input, OnInit } from '@angular/core';
import { ReviewService } from '../publication/review.service';

@Component({
  selector: 'result',
  styleUrls: [ 'result.component.scss' ],
  templateUrl: 'result.component.html'
})
export class ResultComponent implements OnInit {
  @Input() publication;

  private review;
  private imageUrl;

  constructor(private reviewService: ReviewService) { }

  ngOnInit() {
    // FIXME: Corregir las rutas dinamicas
    if (this.publication.images.length) {
      this.imageUrl = 'http://localhost:3001/files/download/' + this.publication.images[0];
    }else {
      this.imageUrl = 'http://localhost:3001/images/noimagen.png';
    }

    this.reviewService.getScore(this.publication._id)
      .subscribe(data => {
        this.review = data.obj;
    });
  }
}