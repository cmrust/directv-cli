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

module.exports.validate = function(IP_ADDRESS, callback){
    if (!/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/.test(IP_ADDRESS)) {
        callback(new Error('This is not a valid IPv4 address: ' + IP_ADDRESS));
    }

    var http = require('http');

    var options = {
        hostname: IP_ADDRESS,
        port: 8080,
        path: '/info/getLocations'
    };

    const TIMEOUT_DURATION = 3000;

    var req = http.request(options, function(res) {
        var body = "";
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            try {
                var parsedBody = JSON.parse(body);
            } catch (err) {
                callback(new Error('Parsing the request body failed: ' + err));
            }
            if (typeof parsedBody !== 'undefined' && typeof parsedBody.status !== 'undefined') {
                if (parsedBody.status.code !== 200) {
                    callback(new Error('Host does not appear to be a valid STB: ' + parsedBody.status.code + ' (' + parsedBody.status.msg + ')'));
                } else {
                    callback(null, parsedBody);
                }
            } else {
                callback(new Error('Host does not appear to be a valid STB'));
            }
        });
    });

    req.on('error', function(err) {
        if (err.message !== 'socket hang up') {
            callback(new Error('HTTP request failed: ' + err));
        }
    });

    req.setTimeout(TIMEOUT_DURATION, function() {
        req.abort();
        callback(new Error('HTTP request timed out after ' + TIMEOUT_DURATION + ' ms'));
    });

    req.end();
};