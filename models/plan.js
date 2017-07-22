let mongoose = require('mongoose');

let planSchema = mongoose.Schema({
    id: String,
    description: String
});

/**
 * Mongoose model for Plan.
 *
 * @class Plan
 * @memberof module:Billing
 * @property {String}       id             - id of plan
 * @property {String}       description    - description of the plan
 */
module.exports = mongoose.model('Plan', planSchema);