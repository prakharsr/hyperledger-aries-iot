const http = require('http');
const url = require('url');
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/client_files/bbb_pin_values.log', {flags : 'w'});
var log_stdout = process.stdout;

module.exports = http.createServer((req, res) => {

    var service = require('./service.js');
    const reqUrl = url.parse(req.url, true);

    // GET Endpoint
    if (reqUrl.pathname == '/webhooks/topic/connections/' && req.method === 'GET') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);

        service.sampleRequest(req, res);

        // POST Endpoint
    } else if (reqUrl.pathname == '/webhooks/topic/connections/' && req.method === 'POST') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);

        service.testRequest(req, res);

    }
    else if (reqUrl.pathname == '/webhooks/topic/ping/' && req.method === 'GET') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);

        service.sampleRequest(req, res);

        // POST Endpoint
    } else if (reqUrl.pathname == '/webhooks/topic/ping/' && req.method === 'POST') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);

        service.testRequest(req, res);

    }
    else if (reqUrl.pathname == '/webhooks/topic/basicmessages/' && req.method === 'GET') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);

        service.sampleRequest(req, res);

        // POST Endpoint
    } else if (reqUrl.pathname == '/webhooks/topic/basicmessages/' && req.method === 'POST') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);

        service.testRequest(req, res);

    }
    else {
        console.log('Request Type:' +
            req.method + ' Invalid Endpoint: ' +
            reqUrl.pathname);

        service.invalidRequest(req, res);

    }
});