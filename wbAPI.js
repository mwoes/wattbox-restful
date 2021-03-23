var exports = (module.exports = {});

var http = require("http");
var parser = require("fast-xml-parser");

var DEBUG = "";
exports.DEBUG = DEBUG;

var Host = "";
exports.Host = Host;
var Uname = "";
exports.Uname = Uname;
var Pass = "";
exports.Pass = Pass;

var Voltage = "";
exports.Voltage = Voltage;
var Current = "";
exports.Current = Current;
var Power = "";
exports.Power = Power;

exports.wattboxCall = function wattboxCall(route, opts) {
  var Login = exports.Uname + ":" + exports.Pass;
  let auth = new Buffer.from(new String(Login)).toString("base64");
  var wbInfo = {
    "Keep-Alive": "300",
    Connection: "keep-alive",
    Authorization: "Basic " + auth + "==",
    "User-Agent": "APP",
  };
  http.get(
    { host: exports.Host, path: route, headers: wbInfo },
    function (response) {
      var body = "";
      var jsonObj = "";
      response.on("data", function (d) {
        body += d;
      });
      response.on("end", function () {
        var options = {
          attributeNamePrefix: "@_",
          attrNodeName: false, //default is 'false'
          textNodeName: "#text",
          ignoreAttributes: true,
          ignoreNameSpace: false,
          allowBooleanAttributes: false,
          parseNodeValue: true,
          parseAttributeValue: false,
          trimValues: true,
          cdataTagName: false, //default is 'false'
          cdataPositionChar: "\\c",
          parseTrueNumberOnly: false,
          attrValueProcessor: (a) => a, //default is a=>a
          tagValueProcessor: (a) => a, //default is a=>a
        };
        if (parser.validate(body) === true) {
          //optional (it'll return an object in case it's not valid)
          jsonObj = parser.parse(body, options);
        }
        if (exports.DEBUG == true) {
          console.log(
            "=======================> [GET REQUEST] <======================="
          );
          console.log("GET " + exports.Host + route);
          console.log(wbInfo);
          console.log(
            "=======================> [RESPONSE BODY] <======================="
          );
          console.log(jsonObj.request);
        }
        exports.Voltage = jsonObj.request.voltage_value / 10 + "V";
        exports.Current = jsonObj.request.current_value / 10 + "A";
        exports.Power = jsonObj.request.power_value + "W";
        if (opts == "vals") {
          exports.printVals();
        }
      });
    }
  );
};

exports.cmd = function Cmd(outlet, command) {
  var cmdType = "";
  var outlet_res = "";
  var newCMD = "/control.cgi?outlet=" + outlet + "&command=" + command;
  if (command == "0") {
    cmdType = "Power Off";
  }
  if (command == "1") {
    cmdType = "Power On";
  }
  if (command == "3") {
    cmdType = "Outlet Reset";
  }
  if (outlet == "0") {
    outlet_res = "All Outlets";
  } else {
    outlet_res = "Outlet " + outlet;
  }
  console.log(
    "Sending " +
      cmdType +
      " to Wattbox @ " +
      exports.Host +
      " for " +
      outlet_res
  );
  exports.wattboxCall(newCMD);
};

exports.vals = function Vals() {
  exports.wattboxCall("/wattbox_info.xml");
};

exports.printVals = function printVals() {
  console.log("Voltage: " + exports.Voltage);
  console.log("Current: " + exports.Current);
  console.log("Power: " + exports.Power);
};
