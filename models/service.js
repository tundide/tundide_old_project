/**
 * The data-layer for a Services
 * @class Service
 * @memberof module:Publication
 */
let mongoose = require('mongoose');
let extend = require('mongoose-schema-extend');
let util = require('util');
let bcrypt = require('bcrypt-nodejs');
let Schema = mongoose.Schema;
let PublicationSchema = require('./publication.base.js');

/**
 * Service schema
 * @constructor Service
 */
let ServiceSchema = PublicationSchema.extend({
    algo: Number
});

/**
 * Find services into publications
 *
 * @function _find
 * @memberof module:Publication.Service
 * @this module:Publication.Service
 * @param {String} query Detail of query to search service
 * @returns True or False
 */
ServiceSchema.statics._find = function(query, next) {
    query._type = 'Service';
    this.find(query, next);
};

module.exports = mongoose.model('Service', ServiceSchema);