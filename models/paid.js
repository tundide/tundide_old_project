let mongoose = require('mongoose');

let paidSchema = mongoose.Schema({
    id: String,
    topic: String
});

/**
 * Mongoose model for Paid.
 *
 * @class Paid
 * @memberof module:Billing
 * @property {String}       id             - id of pay
 * @property {String}       topic          - Identifica de qué se trata. Puede ser: // TODO: Completar que es este parametro
 */
module.exports = mongoose.model('Paid', paidSchema);