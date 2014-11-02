var DirecTV = require('./dtvRemote.js');

var dtvRemote = new DirecTV('192.168.1.114');

dtvRemote.validate();

var args = process.argv.slice(2);

//dtvRemote.getOptions();

//dtvRemote.getLocations();
//dtvRemote.getSerialNum('88f7c7da1456');

//dtvRemote.getVersion();
//dtvRemote.getMode();
//dtvRemote.processKey(args[0], args[1]);
//dtvRemote.processCommand(args[0]);

//dtvRemote.getProgInfo(args[0], args[1], args[2]);
//dtvRemote.getTuned(args[0]);
dtvRemote.tune(args[0], args[1]);
