let mongoose = require('mongoose');

let planSchema = mongoose.Schema({
    id: String,
    description: String
});

/**
 * Mongoose model for Role.
 *
 * @class Role
 * @memberof module:Users~User
 * @property {String}       id             - id of role
 * @property {String}       description    - description of the role
 */
module.exports = mongoose.model('Role', planSchema);