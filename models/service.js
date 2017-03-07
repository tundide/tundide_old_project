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
 * Service schema
 * @constructor Service
 */
let ServiceSchema = PublicationSchema.schema.extend({
    facilities: {
        internet: Boolean,
        airconditioning: Boolean,
        elevator: Boolean,
        heating: Boolean,
        reception: Boolean,
        security: Boolean,
        powerunit: Boolean,
        phone: Boolean,
        gas: Boolean,
        water: Boolean,
        lobby: Boolean,
        buffet: Boolean,
        ramp: Boolean,
        openingtothestreet: Boolean
    },
    location: {
        province: Number,
        place: Number,
        district: Number,
        street: Number,
        number: Number,
        latitude: String,
        longitude: String
    }
});

module.exports = mongoose.model('Service', ServiceSchema);