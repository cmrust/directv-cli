var DirecTV = require('./dtvRemote.js');
var utils = require('./utils.js');

//var dtvRemote = new DirecTV('192.168.1.114');

var args = process.argv.slice(2);

if (utils.isEmpty(args)) {
    console.log('Searching for DirecTV Set Top Boxes (STBs)...');

    utils.findLocalSubnet(function (err, ADDRESS_RANGE) {
        if (err) {
            console.error(err);
        } else {
            var host;
            var count = 0;
            var stbs = [];
            for (host = 1; host < 256; host++) {
                var IP_ADDRESS = ADDRESS_RANGE+host;
                utils.validate(IP_ADDRESS, function(err, res) {
                    count++;
                    if (err) {
                        //console.log(err);
                    } else {
                        for (box in res.locations) {
                            stbs.push({
                                ipAddr: IP_ADDRESS,
                                clientAddr: res.locations[box].clientAddr,
                                locationName: res.locations[box].locationName
                            });
                        }
                    }
                    if (count === 256) {
                        console.log('Found',stbs.length,'STBs.');
                        console.log(stbs);
                    }
                });
            }

        }
    });
} else {
    console.log('Parsing arguments', args);
}

//dtvRemote.validate();

//dtvRemote.getOptions();
//dtvRemote.getLocations();
//dtvRemote.getSerialNum('88f7c7da1456');
//dtvRemote.getVersion();
//dtvRemote.getMode();

//dtvRemote.processKey(args[0], args[1]);
//dtvRemote.processCommand(args[0]);

//dtvRemote.getProgInfo(args[0], args[1], args[2]);
//dtvRemote.getTuned(args[0]);
//dtvRemote.tune(args[0], args[1]);
