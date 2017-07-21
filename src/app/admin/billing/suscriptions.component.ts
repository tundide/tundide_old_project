import { Component, OnInit } from '@angular/core';
import { ToastyService, ToastyConfig } from 'ng2-toasty';
import { BillingService } from './billing.service';
import { Card } from './card.model';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
declare var $: JQueryStatic;
declare var Mercadopago;

@Component({
    selector: 'suscriptions',
    templateUrl: 'suscriptions.component.html'
})
export class SuscriptionsComponent implements OnInit {
    public busy: Subscription;
    public suscriptions: any;

    constructor(
        private toastyService: ToastyService,
        private toastyConfig: ToastyConfig,
        private billingService: BillingService) {
        this.toastyConfig.theme = 'bootstrap';
    }

    ngOnInit() {
        this.busy = this.billingService.getSuscriptions().subscribe(
            res => {
                this.toastyService.success({
                    msg: 'Suscripciones recuperadas correctamente.',
                    showClose: true,
                    theme: 'bootstrap',
                    timeout: 5000,
                    title: 'Obtencion de suscripciones.'
                });
                this.suscriptions = res.data;
            }
        );
    }

    cancelSuscription(id) {
        this.busy = this.billingService.updateSuscription(id, {
            status: 'cancelled'
        }).subscribe(
            res => {
                this.toastyService.success({
                    msg: 'Suscripcion cancelada correctamente.',
                    showClose: true,
                    theme: 'bootstrap',
                    timeout: 5000,
                    title: 'Suscripcion'
                });

                let obj = _.find(this.suscriptions, { id: id });
                _.set(obj, 'status', 'cancelled');
            });
    }

    activateSuscription(id) {
        this.busy = this.billingService.updateSuscription(id, {
            status: 'active'
        }).subscribe(
            res => {
                this.toastyService.success({
                    msg: 'Suscripcion activada correctamente.',
                    showClose: true,
                    theme: 'bootstrap',
                    timeout: 5000,
                    title: 'Suscripcion'
                });

                let obj = _.find(this.suscriptions, { id: id });
                _.set(obj, 'status', 'active');
            });
    }

    pauseSuscription(id) {
        this.busy = this.billingService.updateSuscription(id, {
            status: 'inactive'
        }).subscribe(
            res => {
                this.toastyService.success({
                    msg: 'Suscripcion pausada correctamente.',
                    showClose: true,
                    theme: 'bootstrap',
                    timeout: 5000,
                    title: 'Suscripcion'
                });

                let obj = _.find(this.suscriptions, { id: id });
                _.set(obj, 'status', 'inactive');
            });
    }
}