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
    public plans: any;

    constructor(
        private toastyService: ToastyService,
        private toastyConfig: ToastyConfig,
        private billingService: BillingService) {
        this.toastyConfig.theme = 'bootstrap';
    }

    ngOnInit() {
        this.busy = this.billingService.getPlans().subscribe(
            res => {
                this.toastyService.success({
                    msg: 'Planes recuperados correctamente.',
                    showClose: true,
                    theme: 'bootstrap',
                    timeout: 5000,
                    title: 'Obtencion de planes.'
                });
                this.plans = res.data;
            }
        );
    }

    cancelPlan(id) {
        this.busy = this.billingService.updatePlan(id, {
            status: 'cancelled'
        }).subscribe(
            res => {
                this.toastyService.success({
                    msg: 'Plan cancelado correctamente.',
                    showClose: true,
                    theme: 'bootstrap',
                    timeout: 5000,
                    title: 'Plan'
                });

                let obj = _.find(this.plans, { id: id });
                _.set(obj, 'status', 'cancelled');
            });
    }

    activatePlan(id) {
        this.busy = this.billingService.updatePlan(id, {
            status: 'active'
        }).subscribe(
            res => {
                this.toastyService.success({
                    msg: 'Plan activada correctamente.',
                    showClose: true,
                    theme: 'bootstrap',
                    timeout: 5000,
                    title: 'Plan'
                });

                let obj = _.find(this.plans, { id: id });
                _.set(obj, 'status', 'active');
            });
    }

    pausePlan(id) {
        this.busy = this.billingService.updatePlan(id, {
            status: 'inactive'
        }).subscribe(
            res => {
                this.toastyService.success({
                    msg: 'Plan pausado correctamente.',
                    showClose: true,
                    theme: 'bootstrap',
                    timeout: 5000,
                    title: 'Plan'
                });

                let obj = _.find(this.plans, { id: id });
                _.set(obj, 'status', 'inactive');
            });
    }
}