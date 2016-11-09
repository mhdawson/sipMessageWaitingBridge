# sipMessageWaitingBridge
sip message waiting indicator brige to MQTT

micro-app that connects to sip number to listen for
SIP Notify messages and to track message waiting status.

Provides simple UI that shows message waiting status as
well as posting status to MQTT topic and sending sms
messages when status goes from no messages waiting to
messages waiting.

This is a picture of the simple UI.  The panel flashses
when there is a message waiting and stays grey when there
are no messages waiting.

![messageWaitingUI](https://raw.githubusercontent.com/mhdawson/sipMessageWaitingBridge/master/pictures/message-waiting.jpg?raw=true)

This micro-app can be used with the
[arduino-esp8266/MessageWaitingIndicator](https://github.com/mhdawson/arduino-esp8266/tree/master/MessageWaitingIndicator)
projecct to provide a physical remote message waiting indicator.

# Configuration

After installation modify ../lib/config.json to match
your configuration.

The configuration entries that must be updated include:

* title(optional) - title for the indicator window.
* windowsSize - object with x and y specifying the size of the
  window for the GUI.
* serverPort - port on which the server listens for connections
* sipster - standard configuration for sipster. Key elements
  are as showin the example, with the logconfig in the
  logConfig disabling verbose login, mwiConfig enabling the notify
  message needed to get the message waiting info and idUri,
  regConfig, and sipConfig being set so that
  you can connect to your sip extension.
* mqtt - object with serverUrl, messageWaitingTopic and
  messageInfoTopic.  The messageWaitingTopic is the topic
  to which 1 will be posted when messages are waiting and 0
  when messages are not longer waiting.  The messageInfoTopic
  is the topic to which information about how many messages
  are waiting will be posted.  If the serverUrl
  uses tls (ex mqtts: then certsDir must contain the
  required certificates etc. needed to connect to the
  mqtt server using tls).
* twilio (optional) - object specifying the accountSID,
  accountAuthToken, fromNumber and toNumber that will
  be used to send SMS notifications.

Example with some sensitve information masked out:

```
{
  "title": "Message Waiting",
  "windowSize": { "x":30, "y":30 },
  "serverPort": 3000,
  "sipster": {
    "epconfig": {
      "logConfig": { "msgLogging": 0,
                     "consoleLevel": 0,
                     "level": 0}
    },
    "sip": {
      "idUri": "sip:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      "regConfig": { "registrarUri": "sip:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                     "registerOnAdd": true
                 },
      "mwiConfig": { "enabled": true,
                     "expirationSec": 3600 },
      "sipConfig": { "authCreds": [{ "scheme": "digest",
                                     "realm": "XXXXXXXXXXXXXXXXX",
                                     "username": XXXXXXXXXXXXXXXXX",
                                     "dataType": 0,
                                     "data": "XXXXXXXXX"
                                   }]
                   }
    }
  },
  "mqtt": { "serverUrl": "mqtt:10.1.1.186:1883",
            "messageWaitingTopic": "phone/messageWaiting",
            "messageInfoTopic": "phone/info"
           },
  "twilio": { "accountSID": "XXXXXXXXXXXXXX",
              "accountAuthToken": "XXXXXXXXXXXXX",
              "toNumber": "+15555555555" ,
              "fromNumber": "5555555555" }
}
```

# Installation

This module depends on sipster which in turn depends on pjsua2.
You therefore need to build/install pjsua2 first before installing
the module. I downloaded version 2.5.5. from here:
[http://www.pjsip.org/](http://www.pjsip.org/) 

The default instructions for building/making pjsua2 leave out
one aspect that is required to be able to work with sipster which
is setting -fPIC when compiling/building.  Other than that I
followed the instructions in README.txt and then used make install
to install. 

```
export CFLAGS="$CFLAGS -fPIC"
./configure
make dep
make clean
make
sudo make install
```

Once you have built and installed pjsua2 you can then simply run:

```
npm install micro-app-sip-message-waiting-bridge

or

npm install https://github.com/mhdawson/sipMessageWaitingBridge
```

NOTE: I currently have seen some issues running sipster in release
mode so I used npm rebuild --debug and then renamed the Debug directory
to Release so that I could run using the debug version which seems
to run ok versus the release mode.

# Running

To run the message waiting bridge micro-app add node.js
to your path (currently required 4.x or better) and then run:

```
npm start
```

