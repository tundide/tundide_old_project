/**
 * The data-layer for a Publications
 * @module Publication
 */
let mongoose = require('mongoose');
let util = require('util');
let Schema = mongoose.Schema;

/**
 * Publication schema (Base of publications types)
 * @constructor Publication
 */
let PublicationSchema = mongoose.Schema({
    id: { type: Schema.Types.ObjectId },
    images: [{ type: Schema.Types.ObjectId }],
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    description: String,
    price: Number,
    publishedDate: { type: Date, default: Date.now },
    dateOfExpiration: Date,
    schedules: {
        title: Date,
        startDate: Date,
        endDate: Date,
        user: { type: Schema.Types.ObjectId, ref: 'User' }
    },
    reviews: {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        description: String
    }
}, { collection: 'publications', discriminatorKey: '_type' });

module.exports = PublicationSchema;