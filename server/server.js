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

var http = require('http').Server(app);
var io = require("socket.io")(http);
io.on('connection',function(socket){
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
        http.listen(8080, '0.0.0.0', function() {
            console.log('Listening on port 8080...')
        })
    }
})
