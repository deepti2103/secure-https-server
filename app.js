const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

// ==== HTTP (non-secure) server ====
const http_app = express();
const http_port = 3000;

http_app.get('/', (req, res) => {
    console.log('HTTP GET /');
    res.send('<h1>Hello from an un-secured server</h1><h2 style="color:red;">!!!! AAHHHhhh !!!</h2>');
});

http.createServer(http_app).listen(http_port, () => {
    console.log(`HTTP server running on port ${http_port}`);
});

// ==== HTTPS (secure) server ====
const https_app = express();
const https_port = 3001;

https_app.get('/', (req, res) => {
    console.log('HTTPS GET /');
    res.send('<h1>Hello from a secured server</h1><h2 style="color:green;">Thank god!!!!</h2>');
});

const options = {
    key: fs.readFileSync(path.join(__dirname, 'cert/private-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert/certificate.pem')),
};

https.createServer(options, https_app).listen(https_port, () => {
    console.log(`HTTPS server running on port ${https_port}`);
});
