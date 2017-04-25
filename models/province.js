let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let location = require('./location.js');

let provinceSchema = mongoose.Schema({
    id: { type: Schema.Types.ObjectId },
    code: Number,
    description: String,
    locations: [location.schema],
});

/**
 * Mongoose model for Province.
 *
 * @class Province
 * @memberof module:Province
 * @property {ObjectId}             id               - Id of the province
 * @property {Number}               code             - Code of the province
 * @property {String}               description      - Description of the province
 * @property {Array.<Location>}     locations        - Array of Locations
 */
module.exports = mongoose.model('Province', provinceSchema);