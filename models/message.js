let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let messageSchema = mongoose.Schema({
    message: String,
    date: { type: Date, default: Date.now },
    to: { type: Schema.Types.ObjectId, ref: 'User' },
    from: { type: Schema.Types.ObjectId, ref: 'User' }
});

/**
 * Mongoose model for Message.
 *
 * @class Message
 * @memberof module:Message
 * @property {String}       message          - Message
 * @property {Date}         date             - Date of message
 * @property {ObjectId}     to               - User that recive the message
 * @property {ObjectId}     from             - User that send the message
 */
module.exports = mongoose.model('Message', messageSchema);