let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let locationSchema = mongoose.Schema({
    id: { type: Schema.Types.ObjectId },
    code: Number,
    description: String,
    zip: Number,
});

/**
 * Mongoose model for Province.
 *
 * @class Province
 * @memberof module:Province
 * @property {ObjectId}             id               - Id of the location
 * @property {Number}               code             - Code of the location
 * @property {String}               description      - Description of the location
 * @property {Number}               zip              - Zip Code of the Location
 */
module.exports = mongoose.model('Location', locationSchema);