const url = require('url');
const bbbSetup = require('./GPIO.js');

exports.sampleRequest = function (req, res) {
    const reqUrl = url.parse(req.url, true);
    var name = 'World';
    if (reqUrl.query.name) {
        name = reqUrl.query.name
    }

    var response = {
        "text": "Hello " + name
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
    console.log(JSON.stringify(response));
};


exports.testRequest = function (req, res) {
    body = '';

    req.on('data', function (chunk) {
        body += chunk;
    });

    function isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }    

    req.on('end', function () {

        postBody = JSON.parse(body);

        var response = {
            postBody
        };

        if(isJson(response["postBody"]["content"])) {
            var bbbSetupArgs = JSON.parse(response["postBody"]["content"]);
            
            let bbbInstance = new bbbSetup(bbbSetupArgs["setPin"], bbbSetupArgs["readPin"], bbbSetupArgs["interval"], bbbSetupArgs["setPinType"]);
            
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(response));
        console.log(JSON.stringify(response));
    });
};

exports.invalidRequest = function (req, res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Invalid Request');
};