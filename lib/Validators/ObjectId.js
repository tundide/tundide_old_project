module.exports = {
    isValid: function(objectId) {
        let checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
        return checkForHexRegExp.test(objectId);
    }
};