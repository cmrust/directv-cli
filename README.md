directv-cli
===========

Command line remote control for DirecTV STBs

Usage
-----

To get all of the functionality work, enable external device access on your STB:

    Menu > Settings > Whole-Home > External Device > Allow

To-do
-----

Need to implement key holds.

Implement the error checking from processKey on the other functions.

Credit
------

This code is loosely based on the research done by Jeremy Whitlock for his [directv-remote-api](https://github.com/whitlockjc/directv-remote-api) project. It has been rewritten from the ground up to work on Node.js, without the jQuery and Underscore.js deps, on the command line.
