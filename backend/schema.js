const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    // Add more fields as needed (e.g., user, date, description)
  });
  
const User = mongoose.model('User', userschema);
  
module.exports = User;
