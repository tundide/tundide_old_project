import { Component } from '@angular/core';
import { Router } from '@angular/router';
declare var $: JQueryStatic;

@Component({
    selector: 'footer',
    styleUrls: ['footer.component.scss'],
    templateUrl: 'footer.component.html',
})

export class FooterComponent {
    constructor(private router: Router) { }

}