const url = require('url');
var fs = require('fs');
var util = require('util');
const { exec } = require('child_process');

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

        try {
            postBody = JSON.parse(body);

            var response = {
                postBody
            };
    
            if(isJson(response["postBody"]["content"])) {
                let y = JSON.parse(response["postBody"]["content"]);
                let x = y["beaglebone"]
                if(x) {
                    fs.appendFile(`${__dirname}/client_files/bbb_pin_values.log`, x + "\n", (err, res) => {
                        if(err) console.log(err)
                    })
                    exec(`ipfs-cluster-ctl add -r --name ${new Date().valueOf()} ${__dirname}/client_files`, (err, stdout, stderr) => {
                        if (err) {
                        console.error(`exec error: ${err}`);
                        return;
                        }
                    })
                }   
    
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(response));
    
            // console.log(JSON.stringify(response));   
        } catch (error) {
            
        }

    });
};

exports.invalidRequest = function (req, res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Invalid Request');
};