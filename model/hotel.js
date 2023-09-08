// hotelModel.js
const mongoose = require('mongoose');

// Define the Hotel schema
const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 30
  },
  type: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  city:{
    type:String,
    required:true

  },
  distance: {
    type: String,
    required: true,
    maxLength: 50

  },
  title: {
    type: String,
    required: true,
    maxLength: 150

  },
  desc:{
    type:String,
    maxLength: 250
  },
  rating: {
    type: Number,
    min:0,
    max:5
  },
  photo:{
    required:true,
    type:String,

  },
  rooms: {
    type:[String],
  }, 
  cheapestRoom: {
    type:Number,
    required:true
  }, 
  featured: {
    type:Boolean,
    default:false
  }, 
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Hotel model using the schema
const Hotel = mongoose.model('Hotel', hotelSchema);

// Export the Hotel model for use in other parts of the application
module.exports = Hotel;
