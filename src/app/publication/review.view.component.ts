import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastyService, ToastyConfig } from 'ng2-toasty';
import { ActivatedRoute } from '@angular/router';
import { ReviewService } from './review.service';
import { Review } from './publication.model';

@Component({
  selector: 'review-view',
  styleUrls: ['review.view.component.scss'],
  templateUrl: 'review.view.component.html'
})
export class ReviewViewComponent implements OnInit, OnDestroy {
  private reviews: Array<Review> = [];
  private sub: any;

  constructor(private route: ActivatedRoute,
              private toastyService: ToastyService,
              private toastyConfig: ToastyConfig,
              private reviewService: ReviewService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.reviewService.get(params['id'])
        .subscribe(data => {
          this.reviews = data.obj;
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}