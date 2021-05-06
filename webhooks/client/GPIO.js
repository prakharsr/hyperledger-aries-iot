var b = require('bonescript');
const http = require('http');

class bbbSetup {

    constructor(setPin = "P8_7", readPin = "P8_7", interval = 2000, setPinType = "INPUT", connectionId = "") {

        try {
            console.log(setPin, readPin, interval, setPinType, connectionId)
            this.setPin = setPin;
            this.readPin = readPin;
            this.interval = interval;
            this.setPinType = setPinType;
            this.connectionId = connectionId
            this.setPins();
            this.readPins();

        } catch (error) {
            console.log("Error", error)
        }

    }

    setPins() {
        if(this.setPinType == "INPUT") {
            b.pinMode(this.setPin, b.INPUT);
            console.log("Set pin ", this.setPin, " as INPUT pin\n");
            this.postDataToServer(JSON.stringify({"beaglebone": "Set pin " + this.setPin + " as INPUT pin\n"}), this.connectionId);
        }
        else if(this.setPinType == "OUTPUT") {
                b.pinMode(this.setPin, b.OUTPUT);
                console.log("Set pin ", this.setPin, " as OUTPUT pin\n");
                this.postDataToServer(JSON.stringify({"beaglebone": "Set pin " + this.setPin + " as OUTPUT pin\n"}), this.connectionId);
        }
        else {
                console.log("Choose between INPUT or OUTPUT\n");
                this.postDataToServer(JSON.stringify({"beaglebone": "Choose between INPUT or OUTPUT\n"}), this.connectionId);
        }
    }

    readPins() {
        var rpin = this.readPin;
        var cdId = this.connectionId;
        var pdServer = this.postDataToServer;
        setInterval(digiRead, this.interval);
        console.log("Reading  digital signal from pin ", this.readPin, " every ", this.interval, " milliseconds \n");
        this.postDataToServer(JSON.stringify({"beaglebone": "Reading  digital signal from pin " + this.readPin + " every " + this.interval + " milliseconds \n"}), this.connectionId);

        function digiRead() {
            b.digitalRead(rpin, printStatus);
        }
    
        function printStatus(err, x) {
            if(err) { 
                console.log("Error Occured: ", x);
                pdServer(JSON.stringify({"beaglebone": "Error Occured: " + x}), cdId);
            }
            else {
                // console.log("The value of pin ", rpin, " is :", x);
                pdServer(JSON.stringify({"beaglebone": "The value of pin " + rpin + " is : " + x}), cdId);  
            }
        }
    }

    postDataToServer(data, cdId) {
        
      var options = {
        host: '192.168.6.2',
        port: 8012,
        path: '/connections/'+cdId+'/send-message',
        method: 'POST'
      };
      
      var req = http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          console.log('BODY: ' + chunk);
        });
      });

  
      
      req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
      });
      var message = {"content": data};
      // write data to request body
      req.write(JSON.stringify(message));
      req.end();
    }

}

module.exports = bbbSetup;