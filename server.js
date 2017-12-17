// server.js
// where your node app starts

// init project
var path = require('path')
var express = require('express');
var app = express();
var pug = require('pug');
var route = require('./route/index.js');
var bodyparser = require('body-parser');
// we've started you off with Express, 
// but feel free to use  whatever libs or frameworks you'd like through `package.json`.
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug');
app.use(bodyparser.json())
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
// http://expressjs.com/en/starter/basic-routing.html
app.get("/", route.index);
app.get('/polls/polls', route.list);
app.get('/polls/:id', route.poll);
app.post('/polls', route.create);




// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
