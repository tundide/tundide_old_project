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
 * @property {String}       id             - Score of the publication
 * @property {String}       topic          - Identifica de qué se trata. Puede ser:
 */
module.exports = mongoose.model('Paid', paidSchema);