/**
 * The data-layer for a Publications
 * @module Publication
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let reservation = require('./reservation.js');
/**
 * Publication schema (Base of publications types)
 * @constructor Publication
 */

// TODO: Documentar el modelo nuevo
let PublicationSchema = mongoose.Schema({
    dateOfExpiration: Date,
    description: String,
    id: { type: Schema.Types.ObjectId },
    images: [{ type: Schema.Types.ObjectId }],
    price: Number,
    publishedDate: { type: Date, default: Date.now },
    review: {
        score: Number,
        messages: [reservation.schema]
    },
    reservations: [{
        endDate: Date,
        startDate: Date,
        title: String,
        user: { type: Schema.Types.ObjectId, ref: 'User' }
    }],
    shortId: String,
    status: { type: Number, default: 1 /** Active */ },
    /** 1 - Activa, 2 - Pausada */
    title: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}, { collection: 'publications', discriminatorKey: '_type' });

module.exports = mongoose.model('Publication', PublicationSchema);