const { exec } = require('child_process');

function sleep (seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

try {

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
                exec(`ipfs cat ${latestPin}/bbb_pin_values.log > ${__dirname}/remote_bbb_pin_values.log`, (err, stdout, stderr) => {
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