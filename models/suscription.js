let mongoose = require('mongoose');

let suscriptionSchema = mongoose.Schema({
    id: String,
    description: String
});

/**
 * Mongoose model for Suscription.
 *
 * @class Suscription
 * @memberof module:Billing
 * @property {String}       id             - id of suscription
 * @property {String}       description    - description of the suscription
 */
module.exports = mongoose.model('Suscription', suscriptionSchema);