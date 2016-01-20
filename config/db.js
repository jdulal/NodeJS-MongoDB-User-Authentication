var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

userSchema = mongoose.Schema({
  email: String,
  encryptedPassword: String
});