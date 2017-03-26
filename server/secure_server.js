var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

// Controllers / routers
var controller = require("./controller");

//Express request pipeline
var app = express();
// serve static assets normally
app.use(express.static(path.join(__dirname, "../app/dist")));
app.use(bodyParser.json())

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('*', function (request, response){
    response.sendFile(path.resolve(__dirname, '../app/dist', 'index.html'))
})

app.use("/api", controller);

// Direct to https
var http = require('http');
http.createServer(function(req, res) {   
    res.writeHead(301, {"Location": "https://" + req.headers['host'] + req.url});
    res.end();
}).listen(80, '217.182.42.210');

var https = require('https');
var fs = require("fs");
httpsServer = https.createServer({ 
    key: fs.readFileSync("/etc/letsencrypt/archive/scout-admin.co.uk/privkey1.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/archive/scout-admin.co.uk/fullchain1.pem"),
    ca: fs.readFileSync("/etc/letsencrypt/archive/scout-admin.co.uk/chain1.pem")
}, app);

var io = require("socket.io")(httpsServer);
io.on('connection',function(socket) {
    console.log("A user is connected");
});
exports.emitSocket = function(socket) {
    io.emit(socket);
}

var db = require('../db');
// Connect to MySQL on start
db.connect(db.MODE_PRODUCTION, function(err) {
    if (err) {
        console.log('Unable to connect to MySQL.')
        process.exit(1)
    } else {
        console.log('Connected to database');
        httpsServer.listen(443, '217.182.42.210', function() {
            console.log('Listening on port 443...')
        })
    }
})
