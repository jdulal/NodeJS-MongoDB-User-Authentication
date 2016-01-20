var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var crypto = require('crypto');
var appSecret = process.env.NODE_APP_SECRET;

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (!req.cookies.userID){
    return res.redirect('/users/login');
  }
  
  var User = mongoose.model('User', userSchema);
  User.find({})
    .exec(function(err, users){
    if (err) throw err;
    
    res.status(200).json({users: users});
  });
});

// GET login
router.get('/login', function(req, res, next){
  var notice = req.cookies.notice;
  
  res.render('users/login', {
    notice: notice
  });
});

// POST login
router.post('/login', function(req, res, next){
  var User = mongoose.model('User', userSchema);
  var email = req.param('email');
  var password = req.param('password');
  var encryptedPassword = crypto.createHmac('sha256',appSecret)
                  .update(password)
                  .digest('hex');

  User.findOne({
    email: email,
    encryptedPassword: encryptedPassword
  })
  .exec(function(err, user){
    if (err) throw err;
    
    // email and password does not match
    if (!user){
      console.log('Email and password does not match');
      res.cookie('notice', 'Email and password does not match', {
        maxAge: new Date(Date.now() + 10),
        domain: 'invent-ballet.codio.io'
      });
      return res.redirect('/users/login');
    }
      else {
        res.cookie('userID', user._id, {
          maxAge: new Date(Date.now() + 10),
          domain: 'invent-ballet.codio.io'
        });
        return res.redirect('/users');
      }
  });

});

// GET register
router.get('/signup', function(req, res, next){
  var notice = req.cookies.notice;
  
  res.render('users/register', {
    notice: notice
  });
});

// POST register
router.post('/signup', function(req, res, next){
  var User = mongoose.model('User', userSchema);
  var email = req.param('email');
  var password = req.param('password');
  var passwordAgain = req.param('passwordAgain');
  
  // check if empty
  if (!password || !email){
    console.log('Empty fields.');
    res.cookie('notice', 'Please fill in al the fields correctly', {
      maxAge: new Date(Date.now() + 10),
      domain: 'invent-ballet.codio.io'
    });
    
    return res.redirect('/users/signup');    
  }
  
  // check if passwords match
  if (password !== passwordAgain){
    console.log('Passwords does not match');
    res.cookie('notice', 'Passwords does not match', {
      maxAge: new Date(Date.now() + 10),
      domain: 'invent-ballet.codio.io'
    });
    
    return res.redirect('/users/signup');
  }
  
  // check if user exists
  User.findOne({
    email: email
  })
  .exec(function(err, user){
    if (err) throw err;
    
    if (user){
      console.log('User exists');
      res.cookie('notice', 'User exists', {
        maxAge: new Date(Date.now() + 10),
        domain: 'invent-ballet.codio.io'
      });
      return res.redirect('/users/signup');
    }
      else{
        // encryptd the password
        var encryptedPassword = crypto.createHmac('sha256',appSecret)
                  .update(password)
                  .digest('hex');
        
        
        // create a new user
        var user = new User({
          email: email,
          encryptedPassword: encryptedPassword
        });
        user.save(function(err){
          if (err) throw err;
          res.cookie('notice', 'Successfully registered', {
            maxAge: new Date(Date.now() + 10),
            domain: 'invent-ballet.codio.io'
          });
          
          return res.redirect('/users/login');
        });
      }
  });
  
});

router.get('/logout', function(req, res, next){
  res.clearCookie('userID', {
      domain: 'invent-ballet.codio.io'
  });
  res.redirect('/users/login');
});


module.exports = router;
