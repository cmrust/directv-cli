var DirecTV = require('./dtvRemote.js');

var dtvRemote = new DirecTV('192.168.1.114');

dtvRemote.validate();

var args = process.argv.slice(2);
//getProgInfo(args[0], args[1], args[2]);
dtvRemote.getLocations(1);
//dtvRemote.getSerialNum();
//dtvRemote.getOptions();
//dtvRemote.getVersion();
//getMode(args[0]);
//dtvRemote.getTuned(args[0]);
//processKey(args[0]);
//processCommand(args[0]);
