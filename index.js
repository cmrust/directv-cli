#!/usr/bin/env node
// npm modules
var DirecTV = require('directv-remote');
var program = require('commander');
// node api modules
var fs = require('fs');
var path = require('path');

// declare constants
var HOME_DIR = process.env.HOME || process.env.USERPROFILE;
var CONFIG_FILE = path.join(HOME_DIR,'.directvrc');

// declare global vars
var ipAddr,
    clientAddr;

// parse command line arguments (commander)
program
    .version('0.0.1')
    .option('-i, --ip [address]', 'IP address for the STB [required]')
    .option('-c, --client [address]', 'Client address of networked STB')
    .option('-l, --locations', 'Lists the networked STBs by name and client address')
    .option('-s, --system', 'Lists serial number(s) and version information')
    .option('-w, --watching', 'Lists program info for show currently being watched')
    .option('-k, --key [value]', 'Sends key input to the specified STB')
    .option('-g, --guide [channel]', 'Lists program info for specified channel and time (-d)')
    .option('-d, --date [string]', 'Specify a time to use alongside -g option (default: now)')
    .option('-t, --tune [channel]', 'Tunes the STB to the specified channel')
    .parse(process.argv);

// read the config file
fs.readFile(CONFIG_FILE, 'utf8', function (err, data) {
    // bail if the config file cannot be read
    if (err) return console.error(err);

    try {
        config = JSON.parse(data);
    } catch (err) {
        // again, bail if the config file cannot be read
        return console.log(new Error('Invalid config file: ' + CONFIG_FILE));
    }

    // hoist these vars to the global scope
    ipAddr = program.ip || config.ipAddr;
    clientAddr = program.client || config.clientAddr;

    DirecTV.validateIP(ipAddr, runCommands);
});

function runCommands(err) {
    // if the ipAddr is not that of a valid STB, exit now
    if (err) return console.error(err);

    var Remote = new DirecTV.Remote(ipAddr);

    if (program.locations) {
        Remote.getLocations(1,function(err,response) {
            if (err) return console.error(err);
            if (response.locations.length === 0) {
                console.log('0 Set Top Boxes found');
            } else {
                console.log('Found', response.locations.length, 'Set Top Boxes:');
                for (var stb in response.locations) {
                    console.log(response.locations[stb].locationName + ':', response.locations[stb].clientAddr.toUpperCase());
                }
            }
        });
    }

    if (program.system) {
        console.log('System information:')
        Remote.getVersion(function(err,response) {
            if (err) return console.error(err);
            for (var property in response) {
                console.log(property + ':', response[property]);
            }
        });
        Remote.getSerialNum(undefined, function(err, response) {
            if (err) return console.error(err);
            for (var property in response) {
                console.log(property + ':', response[property]);
            }
        });
    }

    if (program.watching) {
        Remote.getTuned(clientAddr, function(err, response) {
            if (err) return console.error(err);

            console.log('Show:', response.title, '('+response.rating+')');
            if (response.episodeTitle) console.log('Episode:', response.episodeTitle);
            console.log('Channel:', response.callsign, '('+response.major+')');
            var startTime = new Date(response.startTime * 1000);
            var endTime = new Date((response.startTime + response.duration) * 1000);
            console.log('Began:', startTime.toTimeString());
            console.log('Ends:', endTime.toTimeString());
            if (response.rating) console.log('Rating:', response.rating);

        });
    }

    if (program.key) {
        Remote.processKey(program.key, clientAddr, function(err, response) {
            if (err) return console.error(err);
            console.log('Successfully sent', response.key);
        });
    }

    if (program.guide) {
        var channel = program.guide;
        var startTime;

        // if a date/time was provided, parse it
        if (program.date) {
            // processing dates in the format epoch (seconds)
            startTime = (typeof program.date === 'string') ? program.date : undefined;

            // processing dates in the format 2359 === 11:59pm
            if (program.date.length === 4) {
                var startDate = new Date();
                var hours = program.date.substring(0,2);
                var minutes = program.date.substring(2,4);
                startDate.setHours(hours, minutes, '00');
                startTime = parseInt(startDate.getTime() / 1000)
            }

            // processing dates in the format 201412312359 === Dec. 31, 2014 11:59 pm
            if (program.date.length === 12) {
                var startDate = new Date();
                var year = program.date.substring(0,4);
                var month = parseInt(program.date.substring(4,6))-1;
                var day = program.date.substring(6,8);
                startDate.setFullYear(year, month, day);
                var hours = program.date.substring(8,10);
                var minutes = program.date.substring(10,12);
                startDate.setHours(hours, minutes, '00');
                startTime = parseInt(startDate.getTime() / 1000);
            }
        }

        Remote.getProgInfo(channel, startTime, clientAddr, function(err, response) {
            if (err) return console.err(err);
            console.log('Show:', response.title, '('+response.rating+')');
            if (response.episodeTitle) console.log('Episode:', response.episodeTitle);
            console.log('Channel:', response.callsign, '('+response.major+')');
            var startTime = new Date(response.startTime * 1000);
            var endTime = new Date((response.startTime + response.duration) * 1000);
            console.log('Begins:', startTime.toLocaleString());
            console.log('Ends:', endTime.toTimeString());
            if (response.rating) console.log('Rating:', response.rating);
        });
    }

    if (program.tune) {
        var channel = program.tune;

        Remote.tune(channel, clientAddr, function(err, response) {
            if (err) return console.error(err);
            console.log('Successfully changed channel to', channel);
        });
    }
}