// hotelModel.js
const mongoose = require('mongoose');

// Define the Hotel schema
const roomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 120
  },
  price: {
    type: Number,
    required: true
  },
  maxpeople: {
    type: Number,
    required: true
  },
  photo:{
    required:true,
    type:String,

  },
  desc:{
    type:String,
    maxLength: 250
  },

  roomNumbers:[{number:Number,unavialableDates:[{type:Date}]}],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Hotel model using the schema
const Room = mongoose.model('Room', roomSchema);

// Export the Hotel model for use in other parts of the application
module.exports = Room;
