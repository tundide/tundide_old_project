/**
 * The data-layer for a Properties
 * @class Property
 * @memberof module:Publication
 */
let mongoose = require('mongoose');
let extend = require('mongoose-schema-extend');
let Schema = mongoose.Schema;
let PublicationSchema = require('./publication.base.js');

module.exports = mongoose.model('Publication', PublicationSchema);