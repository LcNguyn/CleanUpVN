const express = require('express')
const users = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const User = require('../models/User')

users.use(cors())

process.env.SECRET_KEY = 'secret'

users.get('/', function (req, res) {
  return res.send({error: true, message: 'hello'})
});

users.post('/register', (req, res) => {
  // pool.getConnection(function (err, connection) {
  //   if (err) throw err;
  //   var acc_email = req.param('acc_email','unknown')
  //   var acc_pass = req.param('acc_pass','unknown')
  //   var acc_username  =req.param('acc_username','unknown')
  //   var acc_profile_pic = req.param('acc_profile_pic','unknown')
  //   pool.query("SELECT * from users where acc_email = '"+ acc_email + "'" , (err,rows) => {
  //     if(err) throw err;
  //     if(rows && rows.length === 0) {
  //       console.log("There is no such user, adding now");
  //       bcrypt.genSalt(10, function(err, salt) {
  //         bcrypt.hash(req.param('acc_pass','unknown'), salt, function(err, hash) {
  //           // Store hash a your password DB.
  //           acc_pass = hash
  //           console.log("PASSSSSSSSS" + acc_pass.toString())
  //           var ALPHABET = '0123456789';
  //
  //           var ID_LENGTH = 7;
  //
  //           var generate = function() {
  //             var rtn = '';
  //             for (var i = 0; i < ID_LENGTH; i++) {
  //               rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  //             }
  //             return rtn;
  //           }
  //           var acc_id =  generate()
  //           console.log("HIi")
  //           console.log(acc_pass.toString())
  //           var insertQuery = "INSERT INTO users (acc_id, acc_email, acc_pass, acc_username, acc_profile_pic)" +
  //               " VALUES ('" + acc_id + "', '" + acc_email + "', '" + acc_pass + "', '" + acc_username + "', '" + acc_profile_pic +"')";
  //           connection.query(insertQuery, function (err, result) {
  //             connection.release();
  //             if (err) throw err;
  //             res.send('REGISTERED')
  //           });
  //         });
  //       });
  //
  //
  //       // , function (err, result, fields) {
  //       // connection.release();
  //       console.log("Done")
  //       // if (err) throw err;
  //       // res.json({ "authorize": "true" })
  //       // })
  //
  //     } else {
  //       console.log("User already exists in database");
  //     }
  //   });
  // });

  const today = new Date()
  const userData = {
    acc_username: req.body.acc_username,
    acc_email: req.body.acc_email,
    acc_pass: req.body.acc_pass,
  }
  var ALPHABET = '0123456789';

  var ID_LENGTH = 7;

  var generate = function() {
    var rtn = '';
    for (var i = 0; i < ID_LENGTH; i++) {
      rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return rtn;
  }

  userData.acc_id =  generate()

  User.findOne({
    where: {
      acc_email: req.body.acc_email
    }
  })
    //TODO bcrypt
    .then(user => {
      if (!user) {
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(req.body.acc_pass, salt, function(err, hash) {
            // Store hash in your password DB.
            userData.acc_pass = hash
            User.create(userData)
                .then(user => {
                  res.json({ status: user.acc_email + 'Registered!' })
                })
                .catch(err => {
                  res.send('error: ' + err)
                })
          });
        })
      } else {
        res.json({ error: 'User already exists' })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

users.post('/login', (req, res1) => {
  // pool.getConnection(function (err, connection) {
  //   if (err) throw err;
  //   var acc_email = req.param('acc_email','unknown')
  //   var acc_pass = req.param('acc_pass','unknown')
  //   pool.query("SELECT * from users where acc_email = '"+ acc_email + "'" , (err,rows) => {
  //     if(err) throw err;
  //     console.log("Get hash")
  //     if(rows && rows.length === 0) {
  //       console.log("'User does not exist'");
  //
  //       // , function (err, result, fields) {
  //       // connection.release();
  //       console.log("Done")
  //       // if (err) throw err;
  //       // res.json({ "authorize": "true" })
  //       // })
  //       res.send("User does not exists")
  //     } else {
  //         bcrypt.compare(acc_pass, rows[0].acc_pass, function(err, res) {
  //           // Store hash a your password DB.
  //           var
  //           let token = jwt.sign(user1.dataValues, process.env.SECRET_KEY, {
  //               expiresIn: 1440
  //             })
  //           if (res == true) {
  //             res1.send(token)
  //           } else {
  //             res1.send(res)
  //           }
  //         });
  //       // console.log("User already exists in database");
  //     }
  //   });
  // });
  console.log(req.body.acc_email)
  console.log(req.body.acc_pass)
  User.findOne({
    where: {
      acc_email: req.body.acc_email
    }
  })
    .then(user => {
      if (user) {
        console.log("HI")
        bcrypt.compare(req.body.acc_pass, user.acc_pass, function(err, res) {
          console.log("HI AGAIN")
          console.log(req.body.acc_pass)
          console.log(user.acc_pass)
          if (res == true)  {
            console.log("Hello?")
            let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
              expiresIn: 1440
            })
            console.log(token)
            res1.send(token)
          }
          else {
            res1.send("false")
          }

        });
        // if (bcrypt.compareSync(req.body.acc_pass, user.acc_pass)) {

        // }
      } else {
        res1.status(400).json({ error: 'User does not exist' })
      }
    })
    .catch(err => {
      res1.status(400).json({ error: err })
    })
})

users.get('/profile', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  User.findOne({
    where: {
      acc_id: decoded.acc_id
    }
  })
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        res.send('User does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

module.exports = users
