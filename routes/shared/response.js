module.exports = function Response(res, data) {
    res.data = data;
    return res;
};