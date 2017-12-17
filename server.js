// server.js
// where your node app starts

// init project
var path = require('path')
var express = require('express');
var app = express();
var pug = require('pug');
var route = require('./route/index.js');
var bodyparser = require('body-parser');
var http = require('http')
// we've started you off with Express, 
// but feel free to use  whatever libs or frameworks you'd like through `package.json`.
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug');
app.use(bodyparser.json())
app.set('port',3000)
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
// http://expressjs.com/en/starter/basic-routing.html
app.get("/", route.index);
app.get('/polls/polls', route.list);
app.get('/polls/:id', route.poll);
app.post('/polls', route.create);
// listen for requests :)

var server = http.createServer(app);
 var io = require('socket.io').listen(server);
 io.sockets.on('connection', route.vote);
 server.listen(app.get('port'), function(){
 console.log('Express server listening on port ' + app.get('port'));
 });