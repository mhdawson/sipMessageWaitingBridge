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

# Running



