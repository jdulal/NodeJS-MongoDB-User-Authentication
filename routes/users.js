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
  res.clearCookie('notice', {
      path: '/',
      domain: 'invent-ballet.codio.io'
  });
  
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
        domain: 'invent-ballet.codio.io'
      });
      return res.redirect('/users/login');
    }
      else {
        console.log(user._id);
        res.cookie('userID', user._id, {
          maxAge: new Date(Date.now() + 600),
          domain: 'invent-ballet.codio.io'
        });
        res.locals.userID = user._id;
        return res.redirect('/users/profile');
      }
  });

});

// GET register
router.get('/signup', function(req, res, next){
  var notice = req.cookies.notice;
  res.clearCookie('notice', {
      domain: 'invent-ballet.codio.io'
  });
  
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
      domain: 'invent-ballet.codio.io'
    });
    
    return res.redirect('/users/signup');    
  }
  
  // check if passwords match
  if (password !== passwordAgain){
    console.log('Passwords does not match');
    res.cookie('notice', 'Passwords does not match', {
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
            domain: 'invent-ballet.codio.io'
          });
          
          return res.redirect('/users/login');
        });
      }
  });
  
});

/* GET /users/logout */
router.get('/logout', function(req, res, next){
  res.clearCookie('userID', {
      domain: 'invent-ballet.codio.io'
  });
  res.cookie('notice', 'Logged out', {
    domain: 'invent-ballet.codio.io'
  });
  res.redirect('/users/login');
});

/* GET /users/profile */
router.get('/profile', function(req, res, next){
  var User = mongoose.model('User', userSchema);
  var userID = req.cookies.userID
  // find the user
  User.find({
    '_id': userID
  })
    .exec(function(err, user){
      if (err) throw err;
      
      if (!user){
        return res.redirect('/users/logout');
      } 
        else{
        return res.render('users/profile', {user: user});
      }
  });
  
});


/* GET /users/profile */
router.get('/profile.json', function(req, res, next){
  var userID = req.query['user_id'];
  var User = mongoose.model('User', userSchema);

  // find the user
  User.findOne({
    '_id': userID
  })
    .exec(function(err, user){
      if (err) throw err;
      
      return res.status(200).json(user);
  });
  
});

/* POST /users/update */
router.post('/update.json', function(req, res, next){
  var User = mongoose.model('User', userSchema);
  var userData = req.body;
  var userID = userData['_id'];
  var name = userData['name'];
  var user = new User({
      '_id': userID,
      'name': name
  });
  
  user.update(function(err){
      if (err) throw err;
      
    console.log(user);
      return res.status(200).json(user); 
  });
});



module.exports = router;
