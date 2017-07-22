import { Component } from '@angular/core';
import { ToastyService, ToastyConfig } from 'ng2-toasty';
import { BillingService } from '../billing.service';
import { Subscription } from 'rxjs';
declare var $: JQueryStatic;
declare var Mercadopago;

@Component({
    selector: 'plan',
    styleUrls: ['plan.component.scss'],
    templateUrl: 'plan.component.html'
})
export class PlanComponent {
    busy: Subscription;
    constructor(
        private toastyService: ToastyService,
        private toastyConfig: ToastyConfig,
        private billingService: BillingService) {
        this.toastyConfig.theme = 'bootstrap';
    }

}