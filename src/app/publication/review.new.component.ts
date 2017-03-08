import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastyService, ToastyConfig } from 'ng2-toasty';
import { ActivatedRoute } from '@angular/router';
import { ReviewService } from './review.service';
import { Review } from './publication.model';

@Component({
  selector: 'review-new',
  styleUrls: ['review.new.component.scss'],
  templateUrl: 'review.new.component.html'
})
export class ReviewNewComponent implements OnInit, OnDestroy {
  private review: Review = new Review();
  private sub: any;
  private publicationId: string;

  constructor(private route: ActivatedRoute,
              private toastyService: ToastyService,
              private toastyConfig: ToastyConfig,
              private reviewService: ReviewService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.publicationId = params['id'];
    });
  }

  saveReview() {
    alert(this.publicationId);
    this.reviewService.rateit(this.publicationId, this.review)
      .subscribe(data => {
        this.toastyService.success({
        msg: 'Gracias por ayudar al publicador', // TODO: Corregir el mensage ya que es feo
        showClose: true,
        theme: 'bootstrap',
        timeout: 5000,
        title: 'Comentario enviado con exito.'
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}