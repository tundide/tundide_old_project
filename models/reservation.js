let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let reservationSchema = mongoose.Schema({
    status: { type: Number, default: 0 },
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
 * @property {Number}            status                       - Indicates the status of the reservation (0 - Owner Pending | 
*                                                                                                        1 - Owner Approved | 
                                                                                                         2 - Client Pending | 
                                                                                                         3 - Client Approved | 
                                                                                                         4 - Client Canceled | 
                                                                                                         5 - Owner Canceled) 
 * @property {Date}              endDate                      - End date of reservation
 * @property {Date}              startDate                    - Start date of reservation
 * @property {String}            title                        - The reason that will see the owner
 * @property {ObjectId}          user                         - Id the user request the reservation
 */
module.exports = mongoose.model('Reservation', reservationSchema);