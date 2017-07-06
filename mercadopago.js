let MP = require("mercadopago");

let mp = new MP("TEST-632615168338747-032220-5160380465461a215bbb13beb9774fc1__LD_LB__-46420739");

// Prueba
// let mp = new MP("632615168338747", "F9i0C4BrQd3lEdjI66ywpaxHC0fzMcck");

// let preference = {
//     "items": [{
//             "title": "Plata",
//             "quantity": 1,
//             "currency_id": "ARG",
//             "unit_price": 39
//         },
//         {
//             "title": "Oro",
//             "quantity": 1,
//             "currency_id": "ARG",
//             "unit_price": 119
//         },
//         {
//             "title": "Plantino",
//             "quantity": 1,
//             "currency_id": "ARG",
//             "unit_price": 529
//         }
//     ]
// };

//mp.createPreference(preference);
//let asd = mp.getPreference("PREFERENCE_ID");

mp.post({
    "uri": "/v1/payments",
    "data": {
        "transaction_amount": 100,
        "token": "ff8080814c11e237014c1ff593b57b4d",
        "description": "Title of what you are paying for",
        //"installments": 12,
        "payment_method_id": "visa",
        "payer": {
            "email": "mavitos32@hotmail.com"
        },
        "external_reference": "Reference_1234",
        "statement_descriptor": "MY E-STORE",
        "notification_url": "https://www.tundide.com/pagoexitoso",
        "additional_info": {
            "items": [{
                "id": "item-ID-1234",
                "title": "COmpra de Gold",
                "picture_url": "https://www.mercadopago.com/org-img/MP3/home/logomp3.gif",
                "description": "Item description",
                "category_id": "art", // Available categories at https://api.mercadopago.com/item_categories
                "quantity": 1,
                "unit_price": 100
            }],
            "payer": {
                "first_name": "user-name",
                "last_name": "user-surname",
                "registration_date": "2015-06-02T12:58:41.425-04:00",
                "phone": {
                    "area_code": "11",
                    "number": "4444-4444"
                },
                "address": {
                    "street_name": "Street",
                    "street_number": 123,
                    "zip_code": "5700"
                }
            }
        }
    }
}).then(
    function success(data) {
        console.log(JSON.stringify(data, null, 4));
    },
    function error(err) {
        console.log(err);
    }
);

//console.log(asd);