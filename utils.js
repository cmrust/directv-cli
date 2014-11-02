module.exports.buildQueryString = function(path, qs) {
    firstVar = (path.indexOf('?') === -1) ? true : false;
    for (prop in qs) {
        if (firstVar) {
            path = path + '?' + prop + '=' + qs[prop];
            firstVar = false;
        } else {
            path = path + '&' + prop + '=' + qs[prop];
        }
    }
    return path;
}

module.exports.isEmptyObject = function (obj) {
    return (Object.keys(obj).length === 0) ? true : false;
}