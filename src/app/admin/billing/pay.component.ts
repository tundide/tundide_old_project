import { Component, OnInit } from '@angular/core';
declare var $: JQueryStatic;
declare var Mercadopago;

@Component({
    selector: 'pay',
    templateUrl: 'pay.component.html'
})
export class PayComponent implements OnInit {
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
                            // TODO: Mandar mensaje lindo con notificaciones
                            alert('verify filled data');
                        } else {
console.log(response);
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