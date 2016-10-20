// Copyright 2014-2016 the project authors as listed in the AUTHORS file.
// All rights reserved. Use of this source code is governed by the
// license that can be found in the LICENSE file.
var mqtt = require('mqtt');
var path = require('path');
var fs = require('fs');
var socketio = require('socket.io');
var sipster = require('sipster');
var twilio = require('twilio');
var https = require('https');

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
  // we will only send sms message if message arives after the
  // bridge is started
  var messageAlreadyWaiting = true;

  var config = Server.config;

  eventSocket = socketio.listen(server);

  // setup mqtt
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
  mqttClient.on('connect',function() {
  });

  mqttClient.on('message', function(topic, message) {
  });

  eventSocket.on('connection', function(ioclient) {
    ioclient.on('message', function(event) {
    });
  });

  // initialize pjsip 
  var epconfig = config.sipster.epconfig;
  sipster.init(epconfig);
 
  // set up a transport to listen for incoming connections, defaults to UDP 
  // this is required even though we will be outgoing only
  var transport = new sipster.Transport({ port: 5060 });
 
  // set up sip account
  var acct = new sipster.Account(config.sipster.sip);

  acct.on('notify', function(waiting, info) {
    var messageWaiting = '0';
    if (waiting) {
       messageWaiting = '1';
       if (messageAlreadyWaiting != true) {
          sendSmsMessageVoipms(config, info);
          sendSmsMessageTwilio(config, info);
       }
       messageAlreadyWaiting = true;
    } else {
      messageAlreadyWaiting = false;
    }
    mqttClient.publish(config.mqtt.messageWaitingTopic, messageWaiting);
    mqttClient.publish(config.mqtt.messageInfoTopic, info);
    console.log(new Date() + 'notify received:' + waiting + " " + info);
  });

};


var sendSmsMessageTwilio = function(config, info) {
  if (config.twilio != undefined) {
    var twilioClient = new twilio.RestClient(config.twilio.accountSID, config.twilio.accountAuthToken);
    twilioClient.sendMessage({
      to: config.twilio.toNumber,
      from: config.twilio.fromNumber,
      body: 'Voicemail messages waiting :' + info
    }, function(err, message) {
      if (err) { 
       console.log('Failed to send sms:' + err.message);
      }
    }); 
  }
};

var sendSmsMessageVoipms = function(config, info) {
  if (config.voipms != undefined) {
    var options = { host: 'voip.ms',
                    port: 443,
                    method: 'GET',
                    path: '/api/v1/rest.php?' + 'api_username=' + config.voipms.user + '&' + 
                                                'api_password=' + config.voipms.password + '&' + 
                                                'method=sendSMS' + '&' + 
                                                'did=' + config.voipms.did + '&' + 
                                                'dst=' + config.voipms.dst + '&' + 
                                                'message=' + encodeURIComponent('Voicemail messages waiting:' + info)
                   };
    var request = https.request(options, function(res) {
      if (res.statusCode !== 200) {
        console.log('STATUS:' + res.statusCode);
      }
    }); 
    request.end(); 
  }
}


if (require.main === module) {
  var path = require('path');
  var microAppFramework = require('micro-app-framework');
  microAppFramework(path.join(__dirname), Server);
}


module.exports = Server;
