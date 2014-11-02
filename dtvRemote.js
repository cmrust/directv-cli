var http = require('http');
var utils = require('./utils');

module.exports = function(ipAddress) {
    this.IP_ADDRESS = ipAddress;
    this.port = '8080';

    // Lists the available endpoints on the system
    this.getOptions = function(){
        var path = '/info/getOptions';

        var options = {
            hostname: this.IP_ADDRESS,
            port: 8080,
            path: path
        };

        makeRequest(options, function(err, response){
            console.log(response);
        })
    };

// "List of available client locations."
// Returns an array of the networked set top boxes
// type is an optional parameter
//  the docs label it as 'int'
//  only 0 and 1 aren't *Forbidden*
//  i'm not sure what the difference is yet,
//  but 1 shows more of my wireless Genie STBs
    this.getLocations = function(type){
        var path = '/info/getLocations';

        var options = {
            hostname: this.IP_ADDRESS,
            port: 8080,
            path: path
        };

        if (typeof type !== 'undefined') {
            options.path = utils.buildQueryString(options.path, { type: type });
        }

        makeRequest(options, function(err, response){
            console.log(response);
        })
    };

// "STB serial number."
// clientAddr is optional and for specifying a separate networked STB
    this.getSerialNum = function(clientAddr){
        var path = '/info/getSerialNum';

        var options = {
            hostname: this.IP_ADDRESS,
            port: 8080,
            path: path
        };

        if (typeof clientAddr !== 'undefined') {
            options.path = utils.buildQueryString(options.path, { clientAddr: clientAddr });
        }

        makeRequest(options, function(err, response){
            console.log(response);
        })
    };

// "Set-top-box and SHEF information."
// Also returns the systemTime property, which is the current epoch timestamp.
    this.getVersion = function(){
        var path = '/info/getVersion';

        var options = {
            hostname: this.IP_ADDRESS,
            port: 8080,
            path: path
        };

        makeRequest(options, function(err, response){
            console.log(response);
        })
    };

// "Set-top-box mode."
// clientAddr is optional and for specifying a separate networked STB
// It seems the returned mode property reflects the statuses active (1) and inactive (0)
    this.getMode = function(clientAddr){
        var path = '/info/mode';

        var options = {
            hostname: this.IP_ADDRESS,
            port: 8080,
            path: path
        };

        if (typeof clientAddr !== 'undefined') {
            options.path = utils.buildQueryString(options.path, { clientAddr: clientAddr });
        }

        makeRequest(options, function(err, response){
            console.log(response);
        })
    };

// "Process a key request from the remote control."
// key is a required string value, that corresponds to buttons on the remote, such as:
// format, power, rew, pause, play, stop, ffwd, replay, advance, record, guide, active, list, exit, up, down, select, left, right, back, menu, info, red, green, yellow, blue, chanup, chandown, prev, 1, 2, 3, 4, 5, 6, 7, 8, 9, dash, 0, enter
    this.processKey = function(key, clientAddr){
        var path = '/remote/processKey';

        var options = {
            hostname: this.IP_ADDRESS,
            port: 8080,
            path: path + '?key=' + key
        };

        if (typeof clientAddr !== 'undefined') {
            options.path = utils.buildQueryString(options.path, { clientAddr: clientAddr });
        }

        makeRequest(options, function(err, response){
            if (err) {
                console.log('Request to path:', options.path, 'failed with:', err);
            }
            console.log(response);
        });
    };

// "Process a command request from remote control."
// cmd is a required hex value, such as:
// 'FA81' Standby
// 'FA82' Active
// 'FA83' GetPrimaryStatus
// 'FA84' GetCommandVersion
// 'FA87' GetCurrentChannel
// 'FA90' GetSignalQuality
// 'FA91' GetCurrentTime
// 'FA92' GetUserCommand
// 'FA93' EnableUserEntry
// 'FA94' DisableUserEntry
// 'FA95' GetReturnValue
// 'FA96' Reboot
// 'FAA5' SendUserCommand
// 'FAA6' OpenUserChannel
// 'FA9A' GetTuner
// 'FA8A' GetPrimaryStatusMT
// 'FA8B' GetCurrentChannelMT
// 'FA9D' GetSignalQualityMT
// 'FA9F' OpenUserChannelMT
    this.processCommand = function(cmd){
        var path = '/serial/processCommand';

        var options = {
            hostname: this.IP_ADDRESS,
            port: 8080,
            path: path + '?cmd=' + cmd
        };

        makeRequest(options, function(err, response){
            console.log(response);
        })
    };

// "Program information of specified channel at current or specific time."
// Returns program information for the specified channel, time and STB
// startTime is an optional epoch timestamp, default is now
// clientAddr is optional and for specifying a separate networked STB
    this.getProgInfo = function(channel, startTime, clientAddr){
        var path = '/tv/getProgInfo';

        var options = {
            hostname: this.IP_ADDRESS,
            port: 8080,
            path: path + '?major=' + channel
        };

        if (typeof startTime !== 'undefined') {
            options.path = utils.buildQueryString(options.path, { time: startTime });
        }

        if (typeof clientAddr !== 'undefined') {
            options.path = utils.buildQueryString(options.path, { clientAddr: clientAddr });
        }

        makeRequest(options, function(err, response){
            console.log(response);
        })
    };

// "Information about the currently viewed program."
// NOT WORKING
// does Forbidden possibly mean the cable box is turned off
// clientAddr is optional and for specifying a separate networked STB
    this.getTuned = function(clientAddr){
        var path = '/tv/getTuned';

        var options = {
            hostname: this.IP_ADDRESS,
            port: 8080,
            path: path
        };

        if (typeof clientAddr !== 'undefined') {
            options.path = utils.buildQueryString(options.path, { clientAddr: clientAddr });
        }

        makeRequest(options, function(err, response){
            console.log(response);
        })
    };

// "Tune to a channel."
// NOT TESTED
// clientAddr is optional and for specifying a separate networked STB
    this.tune = function(channel, clientAddr){
        var path = '/tv/tune';

        var options = {
            hostname: this.IP_ADDRESS,
            port: 8080,
            path: path + '?major=' + channel
        };

        if (typeof clientAddr !== 'undefined') {
            options.path = utils.buildQueryString(options.path, { clientAddr: clientAddr });
        }

        makeRequest(options, function(err, response){
            console.log(response);
        })
    };

    var makeRequest = function(options, callback){
        var body = '';
        http.get(options, function(res) {
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
                    console.log('Path:', parsedBody.status.query);
                    if (parsedBody.status.code !== 200) {
                        callback(new Error('Received bad response code: ' + parsedBody.status.code + ' (' + parsedBody.status.msg + ')'));
                    } else {
                        delete parsedBody.status;
                    }
                }
                callback(null, parsedBody);
            });
        }).on('error', function(err) {
            callback(new Error('HTTP request failed: ' + err));
        });
    };
};