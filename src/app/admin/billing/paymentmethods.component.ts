import { Component, OnInit } from '@angular/core';
import { ToastyService, ToastyConfig } from 'ng2-toasty';
import { BillingService } from './billing.service';
import { Card } from './card.model';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
declare var $: JQueryStatic;
declare var Mercadopago;

@Component({
    selector: 'paymentmethods',
    templateUrl: 'paymentmethods.component.html'
})
export class PaymentMethodsComponent implements OnInit {
    public busy: Subscription;
    public cards: any;

    constructor(
        private toastyService: ToastyService,
        private toastyConfig: ToastyConfig,
        private billingService: BillingService) {
        this.toastyConfig.theme = 'bootstrap';
    }

    ngOnInit() {
        this.busy = this.billingService.getCards().subscribe(
            res => {
                this.toastyService.success({
                    msg: 'Tarjetas recuperadas correctamente.',
                    showClose: true,
                    theme: 'bootstrap',
                    timeout: 5000,
                    title: 'Obtencion de metodos de pagos.'
                });
                this.cards = res.data;
            }
        );
    }

    deleteCard(cardId) {
        this.busy = this.billingService.deleteCard(cardId).subscribe(
            res => {
                this.toastyService.success({
                    msg: 'Tarjeta eliminada correctamente.',
                    showClose: true,
                    theme: 'bootstrap',
                    timeout: 5000,
                    title: 'Desvinculacion de tarjeta.'
                });

                _.remove(this.cards, {
                    id: cardId
                });
            }
        );
    }
}