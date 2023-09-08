// UserModel.js
const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxLength: 30
  },
  email: {
    type: String,
    required: true,
    maxLength: 100
  },
  password: {
    type: String,
    required: true,
    maxLength: 100
  },
  phone: {
    type: String,
    required: true,
    maxLength: 11,
    unique:true
  },
  photo:{
    required:true,
    type:String,

  },
  isAdmin:{
    type:Boolean,
    default:false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the User model using the schema
const user = mongoose.model('user', userSchema);

// Export the user model for use in other parts of the application
module.exports = user;
