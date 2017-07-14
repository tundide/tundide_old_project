import { Component, OnInit } from '@angular/core';
import { ToastyService, ToastyConfig } from 'ng2-toasty';
import { BillingService } from '../billing.service';
import { Subscription } from 'rxjs';
declare var $: JQueryStatic;
declare var Mercadopago;

@Component({
    selector: 'suscription-new',
    templateUrl: 'suscription.new.component.html'
})
export class NewComponent implements OnInit {
    busy: Subscription;
    constructor(
        private toastyService: ToastyService,
        private toastyConfig: ToastyConfig,
        private billingService: BillingService) {
        this.toastyConfig.theme = 'bootstrap';
    }

    ngOnInit() {
        $.getScript('https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js', () => {
            Mercadopago.setPublishableKey(process.env.publickey.mercadopago);
            Mercadopago.getIdentificationTypes(function (status, data) {
                $.each(data, function (i, item) {
                    $('#docType').append($('<option>', {
                        text: item.name,
                        value: item.id
                    }));
                });
            });

            let doSubmit = false;
            $('#pay').submit(() => {
                if (!doSubmit) {
                    let $form = $('#pay').get(0);

                    Mercadopago.createToken($form, (status, response) => {
                        if (status !== 200 && status !== 201) {
                            this.toastyService.error({
                                msg: 'Los datos de la tarjeta ingresada no son validos',
                                showClose: true,
                                theme: 'bootstrap',
                                timeout: 5000,
                                title: 'Error en la tarjeta.'
                            });
                        } else {
                            this.busy = this.billingService.associateCard(response.id).subscribe(
                                res => {
                                    this.toastyService.success({
                                        msg: 'La tarjeta ' + res.data.first_six_digits +
                                        'XXXXXXXX fue asociada correctamente a la cuenta.',
                                        showClose: true,
                                        theme: 'bootstrap',
                                        timeout: 5000,
                                        title: 'Asociacion exitosa.'
                                    });
                                    // TODO: Redireccionar a algun lado this.router.navigate(['/view', res.data._id]);
                                }
                            );
                        }
                    });
                    return false;
                }
            });
            $('input[data-checkout="cardNumber"]')
                .keyup((element) => {
                    let bin = this.getBin();
                    if (bin.length >= 6) {
                        Mercadopago.getPaymentMethod({
                            'bin': bin
                        }, this.setPaymentMethodInfo);
                    }
                })
                .change((element) => {
                    let bin = this.getBin();
                    setTimeout(function () {
                        if (bin.length >= 6) {
                            Mercadopago.getPaymentMethod({
                                'bin': bin
                            }, this.setPaymentMethodInfo);
                        }
                    }, 100);
                });
        });
    }

    getBin() {
        let ccNumber = $('input[data-checkout="cardNumber"]');
        return ccNumber.val().toString().replace(/[ .-]/g, '').slice(0, 6);
    }

    setPaymentMethodInfo(status, response) {
        if (status === 200) {
            $('input[name=paymentMethodId]').val(response[0].id);
        }
    }
}