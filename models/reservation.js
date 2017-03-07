let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let reservationSchema = mongoose.Schema({
    approved: { type: Boolean, default: false },
    endDate: Date,
    startDate: Date,
    title: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

/**
 * Mongoose model for Reservation.
 *
 * @class Reservation
 * @memberof module:Publications
 * @property {Boolean}           approved                     - Indicates whether the publication was approved by the owner 
 * @property {Date}              endDate                      - End date of reservation
 * @property {Date}              startDate                    - Start date of reservation
 * @property {String}            title                        - The reason that will see the owner
 * @property {ObjectId}          user                         - Id the user request the reservation
 */
module.exports = mongoose.model('Reservation', reservationSchema);