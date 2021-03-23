/*
Wattbox API v1.0 -- Made by Mason Woessner c/o Harbor Industries
Compatible with SnapAV Wattbox Web API v2.0
*/

//Call in .js module
const wb = require("./wbAPI");

//set hostname/ip of wattbox to be controlled
wb.Host = process.env.WBHOST || "hostname";

//set username/pass used to access wattbox
wb.Uname = "wattbox";
wb.Pass = "wattbox";

//Debugging/verbose logging enabled?
wb.DEBUG = false;

//Command to control outlet (arg 1 = outlet, arg 2 = command)
//oulet options: [0 = all outlets, 1 = outlet 1, 2 = outlet 2, 3 = outlet 3]
//command options [0 = off, 1 = on, 3 = reset, 4 = auto-reboot on, 5 = auto-reboot off]
wb.cmd(1, 1);

//Pull latest information from wattbox and print Voltage/Current/Power to logs
wb.wattboxCall("/wattbox_info.xml", "vals");
