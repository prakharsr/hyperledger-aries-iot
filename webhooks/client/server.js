const hostname = '127.0.0.1';
const port = 3500;
const server = require('./controller.js');
const http = require('http');
const { exec } = require('child_process');
const bbbSetup = require('./GPIO');

function sleep (seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

(async () => {
    var clearCommand = `ps -aux | grep aca-py | awk '{print $2}'`;
    exec(clearCommand, (err, stdout, stderr) => {
        if (err) {
        console.error(`exec error: ${err}`);
        return;
        }
        let pids = stdout.split("\n");
        for(let i=0; i<pids.length; i++) {
            if(pids[i]) {
                exec(`kill -9 ${pids[i]}`, (err, stdout, stderr) => {})
            }
        }
    })

    await sleep(5);
    var portNumber = 8012;

    var command = `aca-py start --inbound-transport http 192.168.6.2 8010 --outbound-transport http --genesis-url http://192.168.6.1:9000/genesis --wallet-storage-type postgres_storage --wallet-storage-config {"url":"http://192.168.6.1:5432"} --admin 0.0.0.0 8012 --admin-insecure-mode -e http://192.168.6.2:8010`;

    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error(`exec error: ${err}`);
            return;
        }
        console.log(`process started at port 8010`);
        })

    await sleep(30).then(() => {
        
        // create-invitation
        
        var create_invitation_req = http.request({
            host: '192.168.6.2',
            port: portNumber,
            path: '/connections/create-invitation',
            method: 'POST',
            accept: 'application/json'
            }, function(res) {
                res.on('data', function (chunk) {
                    let data = '';
                    data += chunk;
                    var invitation_data = JSON.parse(data);
                    var invitation = invitation_data["invitation"];

                    // receive-invitation

                    var receive_invitation_req = http.request({
                        host: '192.168.6.1',
                        port: 8002,
                        path: '/connections/receive-invitation',
                        method: 'POST',
                        accept: 'application/json'
                        }, function(res) {
                            res.on('data', function (chunk) {
                                let data = '';
                                data += chunk;
                                var connection_id_data = JSON.parse(data);
                                var connection_id = connection_id_data["connection_id"];

                                // /connections/{conn_id}/accept-invitation

                                var accept_invitation_req = http.request({
                                    host: '192.168.6.1',
                                    port: 8002,
                                    path: `/connections/${connection_id}/accept-invitation`,
                                    method: 'POST',
                                    accept: 'application/json'
                                    }, function(res) {});

                                    accept_invitation_req.end(JSON.stringify(invitation));

                                    // get_connections

                                    var get_connections = http.request({
                                        host: '192.168.6.2',
                                        port: portNumber,
                                        path: `/connections`,
                                        method: 'GET',
                                        accept: 'application/json'
                                        }, function(res) {
                                            res.on('data', chunk => {
                                                var connections_data = JSON.parse(chunk);
                                                var connection_id_for_process = connections_data["results"][0]["connection_id"];
                                                // /connections/{conn_id}/accept-request

                                                var accept_request = http.request({
                                                    host: '192.168.6.2',
                                                    port: portNumber,
                                                    path: `/connections/${connection_id_for_process}/accept-request`,
                                                    method: 'POST',
                                                    accept: 'application/json'
                                                    }, function(res) {});
                                                accept_request.end(); 

                                                console.log(`Connection id is : ${connection_id_for_process}`)

                                                let bbbInstance = new bbbSetup(setPin = "P8_7", readPin = "P8_7", interval = 2000, setPinType = "INPUT", connectionId = connection_id_for_process);

                                            })
                                        });
                                    get_connections.end(); 

                                });

                            });
                    receive_invitation_req.end(JSON.stringify(invitation));
                });
            });
        create_invitation_req.end()

        })
    })()