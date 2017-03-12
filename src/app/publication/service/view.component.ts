import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'view',
  styleUrls: ['view.component.scss'],
  templateUrl: 'view.component.html'
})
export class ServiceViewComponent implements OnInit {
  starsCount: number;

  ngOnInit() {
    console.log('service');
  }
}