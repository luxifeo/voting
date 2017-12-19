var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://admin:admin@ds123146.mlab.com:23146/url',{useMongoClient:true});
var PollSchema = require('../models/poll.js').PollSchema;
var Poll = db.model('votingpoll', PollSchema);
/////////////////////////////
exports.index = function(req, res) {
  res.render('index', {title: 'Polls'});
};
////////////////////////////////
exports.list = function(req, res) {
  Poll.find({}, 'question', function(error, polls) {
  res.json(polls);
  });
};
//////////////////////////////
exports.poll = function(req, res) {
  console.log(req.params)
  var pollId = req.params.id;
  Poll.findById(pollId, '', { lean: true }, function(err, poll) {
    if(poll) {
      var userVoted = false,
      userChoice,
      totalVotes = 0;
      for(var c in poll.choices) {
        var choice = poll.choices[c];
        for(var v in choice.votes) {
          var vote = choice.votes[v];
          totalVotes++;
          if(vote.ip === (req.header('x-forwarded-for') || req.ip)) {
            userVoted = true;
            userChoice = { _id: choice._id, text: choice.text };
          }
        }
      }
      poll.userChoice = userChoice;
      poll.totalVotes = totalVotes;
      res.json(poll);
    } else {
      res.json({error:true});
    }
  });
};
//////////////////////////////////
exports.create = function(req, res) {
  var reqBody = req.body
  //console.log(req.body)
  var choices = reqBody.choices.filter(function(v) { return v.text != ''; }),
  pollObj = {question: reqBody.question, choices: choices};
  var poll = new Poll(pollObj);
  poll.save(function(err, doc) {
    if(err || !doc) {
      throw 'Error';
    } else {
      res.json(doc);
    }
  });
};
///////////////////////////////////
exports.vote = function(socket) {
  socket.on('send:vote', function(data) {
    //console.log(data);
    var ip = socket.handshake.headers['x-forwarded-for'] ||
      socket.handshake.address.address;
    Poll.findById(data.poll_id, function(err, poll) {
      var choice = poll.choices.id(data.choice);
      choice.votes.push({
        ip: ip
      });
      poll.save(function(err, doc) {
        var theDoc = {
          question: doc.question,
          _id: doc._id,
          choices: doc.choices,
          userVoted: false,
          totalVotes: 0
        };
        for (var i = 0, ln = doc.choices.length; i < ln; i++) {
          var choice = doc.choices[i];
          for (var j = 0, jLn = choice.votes.length; j < jLn; j++) {
            var vote = choice.votes[j];
            theDoc.totalVotes++;
            theDoc.ip = ip;
            if (vote.ip === ip) {
              theDoc.userVoted = true;
              theDoc.userChoice = {
                _id: choice._id,
                text: choice.text
              };
            }
          }
        }
        //console.log(doc)
        socket.emit('myvote', theDoc);
        socket.broadcast.emit('vote', theDoc);
      }); 
    });
  });
};