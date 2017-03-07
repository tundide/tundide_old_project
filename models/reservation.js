/**
 * The data-layer for a Reservation
 * @class Reservation
 * @memberof module:Reservation
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let reservationSchema = mongoose.Schema({
    endDate: Date,
    startDate: Date,
    title: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Reservation', reservationSchema);