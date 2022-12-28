//jshint esversion:6
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const dotenv = require("dotenv").config();

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const candidateSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: [true, "must have fname"]
  },
  lname: {
    type: String,
    required: [true, "must have lname"]
  },
  votes: Number
});

const positionSchema = new mongoose.Schema({
  position: {
    type: String,
    required: [true, "must have position"]
  },
  candidates: [candidateSchema]
})

const Candidate = mongoose.model("Candidate", candidateSchema);
const Election = mongoose.model("Election", positionSchema);

const electionStartingContent = "abcdefghijklmn";

app.get("/", function(req, res) {
  Election.find({}, function(err, result) {
    if (err) {
      res.redirect("/");
    } else {
      res.render("election", {positions: result});
    }
  });
});

app.get("/submit", function(req, res) {
  res.render("electionSubmit");
});

app.get("/:election", function(req, res) {
  Election.find({}, function(err, result) {
    if (err) {
      res.redirect("/");
    } else {
      result.forEach(function(f) {
        if (f.position === req.params.election) {
          var max = f.candidates[0].votes;
          f.candidates.forEach(function(e) {
            if (e.votes > max) {
              max = e.votes;
            }
          })
          res.render("electionPosition", {positions: result, candidates: f.candidates, max: max, electionName: f.position});
        }
      })
    }
  });
});

app.post("/elections", function(req, res) {
  res.redirect("/" + req.body.button);
});

app.post("/submit", function(req, res) {
  var fname = req.body.fname;
  var lname = req.body.lname;
  // const ip = req.headers['x-forwarded-for'] ||
  //    req.connection.remoteAddress ||
  //    req.socket.remoteAddress ||
  //    (req.connection.socket ? req.connection.socket.remoteAddress : null);
  const newCandidate = new Candidate({
    fname: fname,
    lname: lname,
    votes: 1
  });
  Election.findOne({position: req.body.position}, function(err, result) {
    if (err) {
      res.redirect("/");
    } else {
      if (fname === "" || lname === "" || req.body.position === "") {
        res.redirect("/submit");
      } else {
        if (req.body.checkbox === "true") {
          if (!result) {
            const newPosition = new Election({
              position: req.body.position,
              candidates: newCandidate
            });
            newPosition.save(function(err) {
              if (!err) {
                res.redirect("/" + req.body.position);
              }
            });
          } else {
            var hasCandidate = false;
            result.candidates.forEach(function(f) {
              if (f.fname === fname && f.lname === lname) {
                hasCandidate = true;
                f.votes += 1;
                result.save(function(err) {
                  if (!err) {
                    res.redirect("/" + req.body.position);
                  }
                });
              }
            });
            if (!hasCandidate) {
              result.candidates.push(newCandidate);
              result.save(function(err) {
                if (!err) {
                  res.redirect("/" + req.body.position);
                }
              });
            }
          }
        } else {
          res.redirect("/submit");
        }
      }
    }
  });
});

const port = process.env.PORT || 3000;


app.listen(port, function() {
  console.log("Server is up and running.");
});
