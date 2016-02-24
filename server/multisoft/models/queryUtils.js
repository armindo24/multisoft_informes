var QueryUtils = {};

QueryUtils.in = function (array) {
    return "('" + array.join("','") + "')";
};

module.exports = QueryUtils;