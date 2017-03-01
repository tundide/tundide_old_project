import { Component, Input } from '@angular/core';

@Component({
  selector: 'result',
  styleUrls: [ 'result.component.scss' ],
  templateUrl: 'result.component.html'
})
export class ResultComponent {
  @Input() publication;
}