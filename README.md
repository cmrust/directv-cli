directv-cli
===========

This tool makes use of the HTTP API, exposed by most DirecTV STBs (Set Top Boxes), to implement a working remote control on the command line.

Allowing you to simply do things like change the channel:

    directv --tune 297

Or see what's playing on channel 500:

    directv --guide 500

Setup
-----

Install from npm:

    npm install -g directv-cli

If you don't have npm, [install Node.js](https://github.com/joyent/node/wiki/installing-node.js-via-package-manager).

For full functionality make sure you enable external device access on your STB.

    Menu > Settings > Whole-Home > External Device > Allow

Usage
-----

### IP Address

You'll need to specify the IP address of your STB, like in this command:

    directv --ip 192.168.1.104 --watching

> the `--watching` parameter will list program information for whatever is currently being watched

### Whole-Home DVR

If you have Whole-Home DVR service, you can access the extraneous boxes as well. Use the `--locations` switch to list the client addresses for each STB in your home, like:

    $ directv --ip 192.168.1.104 --locations
    Found 3 Set Top Boxes:
    MB: 88F7C7DA0269
    B2: 88F7C7DA1460
    LR: 0

Then you can see what's being watched on any of those boxes, like:

    directv --ip 192.168.1.104 --client 88F7C7DA0269 --watching

### Command line arguments

These switches each come with a shorthand version as well. `--ip` can be shortened to `-i` and `--locations` can be shortened to `-l`.

To see the rest of the available arguments, run the program with a `--help` or `-h` parameter:

    directv --help

### Config file

You can store the variables IP address and client address in a config file, so that they don't have be typed every time the command's invoked.

To store these, create a plaintext file, `.directvrc`, in the user's home directory, with JSON contents like:

    {
      "ipAddr": "192.168.1.104",
      "clientAddr": "88F7C7DA0269"
    }

Then you can issue commands without all the extra switches, like:

    directv --system

> the `--system` switch will output detailed system info

If the `--ip` or `--client` switches are still used, they will override the config file.

### Keys

You're able to send any of the normal remote control keys, such as `guide`, `exit`, `prev`...

The full known list of available keys is:

`format`, `power`

`rew`, `pause`, `play`, `stop`, `ffwd`, `replay`, `advance`, `record`

`guide`, `active`, `list`, `exit`, `menu`, `info`

`up`, `down`, `select`, `left`, `right`

`red`, `green`, `yellow`, `blue`

`back`, `chanup`, `chandown`, `prev`

`1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `dash`, `0`, `enter`

These can be sent, like:

    directv --key yellow

To-Do List
----------

* Implement a find switch, to scan the network for DirecTV hosts

* Implement a REPL to rapid send Key commands