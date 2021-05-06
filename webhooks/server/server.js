const hostname = '127.0.0.1';
const port = 3500;
const server = require('./controller.js');
const { exec } = require('child_process');

function sleep (seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

try {
    
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
    
        await sleep(2);
    
        var command = `cd /home/prakhar/projects/MTP/code/aries-cloudagent-python-0.5.6 && source env/bin/activate && aca-py start --inbound-transport http 192.168.6.1 8000 --outbound-transport http --genesis-url http://192.168.6.1:9000/genesis --wallet-storage-type postgres_storage --wallet-storage-config {"url":"http://192.168.6.1:5432"} --admin 0.0.0.0 8002 --admin-insecure-mode -e http://192.168.6.1:8000 --webhook-url http://127.0.0.1:3500/webhooks`;
            
        exec(command, (err, stdout, stderr) => {
            if (err) {
            console.error(`exec error: ${err}`);
            return;
            }
            console.log(`process started at port 8000`);
        })
    
        await sleep(3);
    })() 
    
    server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });

    setInterval(() => {
        exec(`ipfs-cluster-ctl status | awk '{print $3} {print $1}'`, (err, stdout, stderr) => {
            if (err) {
            console.error(`exec error: ${err}`);
            return;
            }
            let pinsetArray = stdout.split(":\n>\n");
            let latestPin = 0;
            let latestPinIndex = 0;
            for(let i=0; i<pinsetArray.length; i++) {
                if(pinsetArray[i] && latestPin < Number(pinsetArray[i].split(":\n")[0])) {
                    latestPin = pinsetArray[i].split(":\n")[0]; 
                    latestPinIndex = i;
                }
            }

            latestPin = pinsetArray[latestPinIndex].split(":\n")[1].split("\n")[0];

            if(latestPin) {
                exec(`ipfs cat ${latestPin}/bbb_pin_values.log > ${__dirname}/ipfs-cluster-pinned-files/remote_bbb_pin_values.log`, (err, stdout, stderr) => {
                    if (err) {
                    console.error(`exec error: ${err}`);
                    return;
                    }
                })
            }

            // delete all pinsets

            // for(let i=0; i<pinsetArray.length; i++) {
                 
            //     if(pinsetArray[i]) {
            //         let id = ((pinsetArray[i].split(":\n")[0]).split("\n"))[1];
            //         exec(`ipfs-cluster-ctl pin rm ${id}`, (err, stdout, stderr) => {
            //             if (err) {
            //             console.error(`exec error: ${err}`);
            //             return;
            //             }
            //         })  
            //     }
            // }
        })
    }, 2000);
    
} catch (error) {
    console.log("Error", error)
}