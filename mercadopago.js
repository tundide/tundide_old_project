let config = require('./config/app.json')[process.env.NODE_ENV || 'development'];
let MP = require("mercadopago");
let mp = new MP(config.billing.accessToken);



saved_customer = mp.get("/v1/customers/search", {
    "email": "marcos.panichella@gmail.com"
});

saved_customer.then(function(customer) {
    if (customer.response.results.length > 0) {
        let card = { "token": "e45c5e788623a26c6c08ccf6121c8b6e" };

        let addCard = mp.post("/v1/customers/" + customer.response.results[0].id + "/cards", card);

        addCard.then(
            function(cardData) {
                console.log(cardData);
            },
            function(error) {
                console.log(error);
            });
    } else {

    }
});





////////////////////////BORRAR ASOCIACION DE USUARIO
// saved_customer = mp.get("/v1/customers/search", {
//     "email": "marcos.panichella@gmail.com"
// });

// saved_customer.then(function(customer) {
//     if (customer.response.results.length > 0) {
//         let createCustomer = mp.delete("/v1/customers/" + customer.response.results[0].id);

//         createCustomer.then(
//             function(customerData) {
//                 console.log(customerData);
//             },
//             function(error) {
//                 console.log(error);
//             });
//     } else {

//     }
// });
////////////////////////BORRAR ASOCIACION DE USUARIO

module.exports = {
    // let preapprovalData = {
    //     "payer_email": "mpanichella@live.com",
    //     "back_url": "http://www.tundide.com",
    //     "reason": "Suscripcion mensual de Plata",
    //     "external_reference": "Plata-123456",
    //     "auto_recurring": {
    //         "frequency": 1,
    //         "frequency_type": "months",
    //         "transaction_amount": 1,
    //         "currency_id": "ARS",
    //         "start_date": "2017-09-10T14:58:11.778-03:00",
    //         "end_date": "2017-09-10T14:58:11.778-03:00"
    //     }
    // };

    // 46420739-xuekai5qaPVYdD mpanichella@live.com
    createPlan: function() {
        let preapprovalData = mp.post("/v1/plans", {
            "description": "Subscripcion de Plata",
            "auto_recurring": {
                "debit_date": 1,
                "frequency": 1,
                "frequency_type": "months",
                "transaction_amount": 49,
                "currency_id": "ARS",
                "free_trial": {
                    "frequency": 1,
                    "frequency_type": "months",
                }
            }
        });

        preapprovalData.then(
            function(customerData) {
                console.log(customerData);
            },
            function(error) {
                console.log(error);
            });
    },
    asosciateCustomerWithPlan: function() {
        let customerToPlan = mp.post("/v1/subscriptions", {
            "plan_id": "85cdebd319bb4bf8a2b2f2934bf775d8",
            "payer": {
                "id": "46420739-xuekai5qaPVYdD"
            } //e45c5e788623a26c6c08ccf6121c8b6e default card
        });

        customerToPlan.then(
            function(customerData) {
                console.log(customerData);
            },
            function(error) {
                console.log(error);
            });

    },
    associateCard: function(customerId, cardId) {
        let card = { "token": cardId };

        let addCard = mp.post("/v1/customers/" + customerId + "/cards", card);

        addCard.then(
            function(cardData) {
                console.log(cardData);
            },
            function(error) {
                console.log(error);
            });
    },
    createCustomer: function(customer) {
        return mp.post("/v1/customers", customer);


        // saved_customer = mp.get("/v1/customers/search", customer);

        // saved_customer.then(function(customer) {
        //     if (customer.result.length > 0) {
        //         let addCard = mp.post("/v1/customers/" + customer.response.results[0].id + "/cards", { "token": "e45c5e788623a26c6c08ccf6121c8b6e" });

        //         addCard.then(
        //             function(cardData) {
        //                 console.log(cardData);
        //             },
        //             function(error) {
        //                 console.log(error);
        //             });
        //     } else {

        //     }
        // });
    }

    // let mp = new MP("2875862101013091", "4BbAf0EeRu8SeiSMXCMts8bS8px2nfKh");
    // let getPayment = mp.get("/v1/payments/56d9db00058d467d99f3d18cd2cffe57");

    // getPayment.then(
    //     function(paymentData) {
    //         console.log(paymentData);
    //     },
    //     function(error) {
    //         console.log(error);
    //     });




























    // mp.getPayment('56d9db00058d467d99f3d18cd2cffe57', function(err, data) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log(data);
    //     }
    // });

    // let preapprovalData = {
    //     "payer_email": "mpanichella@live.com",
    //     "back_url": "http://www.tundide.com",
    //     "reason": "Suscripcion mensual de Plata",
    //     "external_reference": "Plata-123456",
    //     "auto_recurring": {
    //         "frequency": 1,
    //         "frequency_type": "months",
    //         "transaction_amount": 1,
    //         "currency_id": "ARS",
    //         "start_date": "2017-09-10T14:58:11.778-03:00",
    //         "end_date": "2017-09-10T14:58:11.778-03:00"
    //     }
    // };

    // mp.getAccessToken(function(err, accessToken) {
    //     console.log(accessToken);
    // });

    // mp.createPreapprovalPayment(preapprovalData, function(err, data) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log(data);
    //         console.log(data.response.init_point);
    //     }
    // });
};