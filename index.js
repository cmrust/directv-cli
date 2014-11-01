#!/usr/bin/env node
// DirecTV
var request = require('request');

const IP_ADDRESS = '192.168.1.114';

// Lists the available endpoints on the system
var getOptions = function(){
    var route = '/info/getOptions';

    var options = {
        url: 'http://' + IP_ADDRESS + ':8080' + route
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
var getLocations = function(type){
    var route = '/info/getLocations';

    var options = {
        url: 'http://' + IP_ADDRESS + ':8080' + route,
        qs: { }
    };

    if (typeof type !== 'undefined') {
        options.qs.type = type;
    }

    makeRequest(options, function(err, response){
        console.log(response);
    })
};

// "STB serial number."
// clientAddr is optional and for specifying a separate networked STB
var getSerialNum = function(clientAddr){
    var route = '/info/getSerialNum';

    var options = {
        url: 'http://' + IP_ADDRESS + ':8080' + route,
        qs: { }
    };

    if (typeof clientAddr !== 'undefined') {
        options.qs.clientAddr = clientAddr;
    }

    makeRequest(options, function(err, response){
        console.log(response);
    })
};

// "Set-top-box and SHEF information."
// Also returns the systemTime property, which is the current epoch timestamp.
var getVersion = function(){
    var route = '/info/getVersion';

    var options = {
        url: 'http://' + IP_ADDRESS + ':8080' + route
    };

    makeRequest(options, function(err, response){
        console.log(response);
    })
};

// "Set-top-box mode."
// clientAddr is optional and for specifying a separate networked STB
// It seems the returned mode property reflects the statuses active (1) and inactive (0)
var getMode = function(clientAddr){
    var route = '/info/mode';

    var options = {
        url: 'http://' + IP_ADDRESS + ':8080' + route,
        qs: { }
    };

    if (typeof clientAddr !== 'undefined') {
        options.qs.clientAddr = clientAddr;
    }

    makeRequest(options, function(err, response){
        console.log(response);
    })
};

// "Process a key request from the remote control."
// key is a required string value, that corresponds to buttons on the remote, such as:
// format, power, rew, pause, play, stop, ffwd, replay, advance, record, guide, active, list, exit, up, down, select, left, right, back, menu, info, red, green, yellow, blue, chanup, chandown, prev, 1, 2, 3, 4, 5, 6, 7, 8, 9, dash, 0, enter
var processKey = function(key, clientAddr){
    var route = '/remote/processKey';

    var options = {
        url: 'http://' + IP_ADDRESS + ':8080' + route,
        qs: { key: key }
    };

    if (typeof clientAddr !== 'undefined') {
        options.qs.clientAddr = clientAddr;
    }

    makeRequest(options, function(err, response){
        console.log(response);
    })
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
var processCommand = function(cmd){
    var route = '/serial/processCommand';

    var options = {
        url: 'http://' + IP_ADDRESS + ':8080' + route,
        qs: { cmd: cmd }
    };

    makeRequest(options, function(err, response){
        console.log(response);
    })
};

// "Program information of specified channel at current or specific time."
// Returns program information for the specified channel, time and STB
// startTime is an optional epoch timestamp, default is now
// clientAddr is optional and for specifying a separate networked STB
var getProgInfo = function(channel, startTime, clientAddr){
    var route = '/tv/getProgInfo';

    var options = {
        url: 'http://' + IP_ADDRESS + ':8080' + route,
        qs: { major: channel }
    };

    if (typeof startTime !== 'undefined') {
        options.qs.time = startTime;
    }

    if (typeof clientAddr !== 'undefined') {
        options.qs.clientAddr = clientAddr;
    }

    makeRequest(options, function(err, response){
        console.log(response);
    })
};

// "Information about the currently viewed program."
// NOT WORKING
// does Forbidden possibly mean the cable box is turned off
// clientAddr is optional and for specifying a separate networked STB
var getTuned = function(clientAddr){
    var route = '/tv/getTuned';

    var options = {
        url: 'http://' + IP_ADDRESS + ':8080' + route,
        qs: { }
    };

    if (typeof clientAddr !== 'undefined') {
        options.qs.clientAddr = clientAddr;
    }

    makeRequest(options, function(err, response){
        console.log(response);
    })
};

// "Tune to a channel."
// NOT TESTED
// clientAddr is optional and for specifying a separate networked STB
var tune = function(channel, clientAddr){
    var route = '/tv/tune';

    var options = {
        url: 'http://' + IP_ADDRESS + ':8080' + route,
        qs: { major: channel }
    };

    if (typeof clientAddr !== 'undefined') {
        options.qs.clientAddr = clientAddr;
    }

    makeRequest(options, function(err, response){
        console.log(response);
    })
};

var makeRequest = function(options, callback){
    request.get(options, function (err, res, body){
        if (err) {
            callback(err);
        } else {
            try {
                parsed_body = JSON.parse(body);
            } catch (err) {
                callback(new Error('Parsing the request body failed', err));
            }
            callback(null, parsed_body);
        }
    });
};

var args = process.argv.slice(2);
//getProgInfo(args[0], args[1], args[2]);
//getLocations();
//getSerialNum();
//getOptions();
//getVersion();
//getMode(args[0]);
//getTuned(args[0]);
processKey(args[0]);
//processCommand(args[0]);
