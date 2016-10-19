// Copyright 2014-2016 the project authors as listed in the AUTHORS file.
// All rights reserved. Use of this source code is governed by the
// license that can be found in the LICENSE file.
var mqtt = require('mqtt');
var path = require('path');
var fs = require('fs');
var socketio = require('socket.io');
var sipster = require('sipster');

///////////////////////////////////////////////
// Logging
///////////////////////////////////////////////
var eventLogFile; 
function logEvent(event) {
 // no point to provide error function as we won't do
 // anything in case of an error
 fs.appendFile(eventLogFile, new Date() + ' :' + event + '\n');
}

///////////////////////////////////////////////
// micro-app framework methods
///////////////////////////////////////////////
var Server = function() {
}


Server.getDefaults = function() {
  return { 'title': 'sip message bridge' };
}


var replacements;
Server.getTemplateReplacments = function() {
  if (replacements === undefined) {
    var config = Server.config;
    replacements = [{ 'key': '<ALARM DASHBOARD TITLE>', 'value': config.title },
                    { 'key': '<UNIQUE_WINDOW_ID>', 'value': config.title },
                    { 'key': '<PAGE_WIDTH>', 'value': PAGE_WIDTH },
                    { 'key': '<PAGE_HEIGHT>', 'value': PAGE_HEIGHT }];

  }
  return replacements;
}

Server.startServer = function(server) {
  var config = Server.config;
  eventLogFile = path.join(Server.config.eventLogPrefix, 'event_log');

  eventSocket = socketio.listen(server);

  // setup mqtt
/*
  var mqttOptions;
  if (config.mqtt.serverUrl.indexOf('mqtts') > -1) {
    mqttOptions = { key: fs.readFileSync(path.join(__dirname, 'mqttclient', '/client.key')),
                    cert: fs.readFileSync(path.join(__dirname, 'mqttclient', '/client.cert')),
                    ca: fs.readFileSync(path.join(__dirname, 'mqttclient', '/ca.cert')),
                    checkServerIdentity: function() { return undefined }
    }
  }

  var mqttClient = mqtt.connect(config.mqtt.serverUrl, mqttOptions);

  // each time we connect register on all topics we are interested
  // in.  This must be done after a reconnect as well as the
  // initial connect
  ///
  mqttClient.on('connect',function() {
  });

  mqttClient.on('message', function(topic, message) {
  });
*/

  eventSocket.on('connection', function(ioclient) {
    ioclient.on('message', function(event) {
    });
  });

  // initialize pjsip 
  sipster.init(config.sipster.epconfig);
 
  // set up a transport to listen for incoming connections, defaults to UDP 
  // this is required even though we will be outgoing only
  var transport = new sipster.Transport({ port: 5060 });
 
  // set up sip account
  var sipConfig = config.sipster.sip;
  var acct = new sipster.Account(sipConfig);

  acct.on('notify', function(waiting, info) {
    console.log('notify received:' + waiting + " " + info);
  });

  logEvent('Bridge active');
};


if (require.main === module) {
  var path = require('path');
  var microAppFramework = require('micro-app-framework');
  microAppFramework(path.join(__dirname), Server);
}


module.exports = Server;
