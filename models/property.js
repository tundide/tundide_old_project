/**
 * The data-layer for a Properties
 * @class Property
 * @memberof module:Publication
 */
let mongoose = require('mongoose');
let extend = require('mongoose-schema-extend');
let util = require('util');
let bcrypt = require('bcrypt-nodejs');
let Schema = mongoose.Schema;
let PublicationSchema = require('./publication.js');

/**
 * Property schema
 * @constructor Property
 */
let PropertySchema = PublicationSchema.schema.extend({
    facilities: {},
    location: {
        province: Number,
        place: Number,
        street: String,
        number: Number,
        latitude: Number,
        longitude: Number
    }
}, { strict: false });

/**
 * Find properties into publications
 *
 * @function _find
 * @memberof module:Publication.Property
 * @this module:Publication.Property
 * @param {String} query Detail of query to search property
 * @returns True or False
 */
PropertySchema.statics._find = function(query, next) {
    query._type = 'Property';
    this.find(query, next);
};

module.exports = mongoose.model('Property', PropertySchema);