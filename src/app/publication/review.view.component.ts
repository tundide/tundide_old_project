import { Component, Input } from '@angular/core';
import { Review } from './publication.model';

@Component({
  selector: 'review-view',
  styleUrls: ['review.view.component.scss'],
  templateUrl: 'review.view.component.html'
})
export class ReviewViewComponent {
  @Input() reviews: Array<Review>;
}