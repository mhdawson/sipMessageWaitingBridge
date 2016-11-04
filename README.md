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

!$[messageWaitingUI](https://raw.githubusercontent.com/mhdawson/sipMessageWaitingBridge/master/pictures/message-waiting.jpg?raw=true)

This micro-app can be used with the
[arduino-esp8266/MessageWaitingIndicator](https://github.com/mhdawson/arduino-esp8266/tree/master/MessageWaiingIndicator)
projecct to provide a physical remote message waiting indicator.

# Configuration

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


# Running

To run the message waiting bridge micro-app add node.js to your path (currently required 4.x or better) and then run:

```
npm start
```

# Rey dependencies
