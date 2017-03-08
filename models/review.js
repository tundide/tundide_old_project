let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let reviewSchema = mongoose.Schema({
    score: Number,
    message: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

/**
 * Mongoose model for Review.
 *
 * @class Review
 * @memberof module:Publications
 * @property {Number}       score            - Score of the publication
 * @property {String}       message         - Message of the score
 * @property {ObjectId}     user             - User that gave the score
 */
module.exports = mongoose.model('Review', reviewSchema);