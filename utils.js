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
};

module.exports.isEmpty = function (obj) {
    return (Object.keys(obj).length === 0) ? true : false;
};

module.exports.findLocalSubnet = function (callback) {
    require('dns').lookup(require('os').hostname(), function (err, address, fam) {
        if (err) {
            callback(new Error('Failed to find current local IP address: ' + err));
        } else {
            callback(null, address.split('.').slice(0,3).join('.') + '.');
        }
    });
};