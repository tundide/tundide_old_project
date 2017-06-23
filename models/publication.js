/**
 * The data-layer for a Publications
 * @module Publications
 */

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let reservation = require('./reservation.js');
let review = require('./review.js');

let PublicationSchema = mongoose.Schema({
    dateOfExpiration: Date,
    description: String,
    id: { type: Schema.Types.ObjectId },
    images: [{ type: Schema.Types.ObjectId }],
    price: Number,
    configuration: {
        showCalendar: Boolean
    },
    publishedDate: { type: Date, default: Date.now },
    reviews: [review.schema],
    reservations: [reservation.schema],
    shortId: String,
    status: { type: Number, default: 1 },
    title: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}, { collection: 'publications', discriminatorKey: '_type' });

/**
 * Mongoose model for Publications.
 *
 * @class Publication
 * @memberof module:Publications
 * @property {Date}                  dateOfExpiration              - Indicates the expiration of the publication
 * @property {String}                description                   - Descriptio nof publication
 * @property {ObjectId}              id                            - Id of publication
 * @property {Array.<ObjectId>}      images                        - Images of publication
 * @property {Number}                price                         - Price per hour of publication
 * @property {Configuration}         configuration                 - Custom configuration of publication
 * @property {Date}                  publishedDate=Now             - Date of publication
 * @property {Array.<Review>}        review                        - Reviews of publication
 * @property {Array.<Reservation>}   reservations                  - Reservations of publication
 * @property {String}                shortId                       - Short ID to identify the publication
 * @property {Number}                status=1                      - Status of publication (1 - Active, 2 - Paused)
 * @property {String}                title                         - Title of publication
 * @property {ObjectId}              user                          - Id the owner of the publication
 */
module.exports = mongoose.model('Publication', PublicationSchema);