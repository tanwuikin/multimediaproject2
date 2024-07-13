/*
const express = require('express');
const app = express();
const fs = require('fs');

app.get('/', function(req, res){
    res.sendFile(__dirname+ "/index.html");
})


app.get('/video', function(req, res){
    const range = req.headers.range;
    if(!range){
        res.status(400).send("Requires Range header");
    }
    const videoPath = "./cdn.mp4";
    const videoSize = fs.statSync(videoPath).size;
    // console.log("size of video is:", videoSize);
    const CHUNK_SIZE = 10**6; //1 MB
    const start = Number(range.replace(/\D/g, "")); 
    const end = Math.min(start + CHUNK_SIZE , videoSize-1);
    const contentLength = end-start+1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": 'bytes',
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    }
    res.writeHead(206,headers);
    const videoStream = fs.createReadStream(videoPath,{start, end});
    videoStream.pipe(res);

})

app.listen(3000, function(){
    console.log("Server is running on port:", 3000);
})
*/

/*
const express = require('express');
const app = express();
const fs = require('fs');

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get('/video', function(req, res) {
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
        return;
    }

    const videoName = req.query.name;
    if (!videoName) {
        res.status(400).send("Requires video name");
        return;
    }

    const videoPath = `./${videoName}.mp4`;
    if (!fs.existsSync(videoPath)) {
        res.status(404).send("Video not found");
        return;
    }

    const videoSize = fs.statSync(videoPath).size;
    const CHUNK_SIZE = 10 ** 6; // 1 MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": 'bytes',
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    };

    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});

app.listen(2999, function() {
    console.log("Server is running on port:", 2999);
});
*/

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

// Function to simulate QoS parameters
function calculateQoS() {
    const latency = Math.floor(Math.random() * 900) + 100; // 100 to 1000 milliseconds
    const bitrate = Math.floor(Math.random() * 4500) + 500; // 500 to 5000 kbps
    const packetLoss = (Math.random() * 10).toFixed(2); // 0.00 to 10.00
    const syncSkew = Math.floor(Math.random() * 200) - 100; // -100 to 100 milliseconds
    const playbackJitter = Math.floor(Math.random() * 50); // 0 to 50 milliseconds

    return { latency, bitrate, packetLoss, syncSkew, playbackJitter };
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get('/video', function(req, res) {
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
        return;
    }

    const videoName = req.query.name;
    if (!videoName) {
        res.status(400).send("Requires video name");
        return;
    }

    const videoPath = path.join(__dirname, 'public', `${videoName}.mp4`);
    if (!fs.existsSync(videoPath)) {
        res.status(404).send("Video not found");
        return;
    }

    const videoSize = fs.statSync(videoPath).size;
    const CHUNK_SIZE = 10 ** 6; // 1 MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": 'bytes',
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    };

    // Simulate QoS parameters
    const qosParams = calculateQoS();

    // Append QoS headers
    Object.assign(headers, {
        "X-Latency": qosParams.latency,
        "X-Bitrate": qosParams.bitrate,
        "X-Packet-Loss": qosParams.packetLoss,
        "X-Sync-Skew": qosParams.syncSkew,
        "X-Playback-Jitter": qosParams.playbackJitter
    });

    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});

app.listen(2999, function() {
    console.log("Server is running on port:", 2999);
});



/*
const express = require('express');
const AWS = require('aws-sdk');
const app = express();
const PORT = 3000;

// Configure AWS SDK
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'your-region' // e.g., 'us-west-2'
});

// Middleware to handle video streaming
app.get('/video', (req, res) => {
    const videoName = req.query.name;
    if (!videoName) {
        return res.status(400).send('Video name is required');
    }

    const params = {
        Bucket: 'your-bucket-name',
        Key: videoName
    };

    s3.getObject(params, (err, data) => {
        if (err) {
            console.error('Error fetching video from S3', err);
            return res.status(500).send('Error fetching video from S3');
        }

        res.writeHead(200, {
            'Content-Type': 'video/mp4',
            'Content-Length': data.ContentLength
        });
        res.end(data.Body);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
*/
