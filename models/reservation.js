let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let reservationSchema = mongoose.Schema({
    status: { type: Number, default: 1 },
    endDate: { type: Date, default: Date.now },
    startDate: { type: Date, default: Date.now },
    title: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

/**
 * Mongoose model for Reservation.
 *
 * @class Reservation
 * @memberof module:Publications
 * @property {Number}            status                       - Indicates the status of the reservation (0 - Approved | 1 - Pending | 2 - Canceled) 
 * @property {Date}              endDate                      - End date of reservation
 * @property {Date}              startDate                    - Start date of reservation
 * @property {String}            title                        - The reason that will see the owner
 * @property {ObjectId}          user                         - Id the user request the reservation
 */
module.exports = mongoose.model('Reservation', reservationSchema);