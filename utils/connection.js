
const mongoose = require('mongoose');

const url = process.env.MONGOURI // Change this URL to your MongoDB server and database name

const connectDB = async () => {
  try {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected successfully to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

module.exports = connectDB;
