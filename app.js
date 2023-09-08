const express = require("express")
const mongoose = require("mongoose")
const app = express()
var cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const port = process.env.PORT
const path = require("path")
const connecDb = require("./utils/connection")
const hotelRoute = require("./router/hotel")
const authRoute = require("./router/auth")
const roomRoute = require("./router/room")
const userRoute = require("./router/user")
const upload = require("./utils/multerconfig")
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(upload.any());
app.use(cookieParser())

//route middleware
app.use('/upload', express.static(path.join(__dirname, 'upload')));
app.use("/api/v1/auth",authRoute)
app.use("/api/v1/user",userRoute)
app.use("/api/v1/hotel",hotelRoute)
app.use("/api/v1/room",roomRoute)

//next function
app.use((err, req, res, next) => {
    let errorMessage;
  
    // Check if the error is a Mongoose validation error
    if (err.name === "ValidationError") {
      // Extract the first validation error message
      errorMessage = Object.values(err.errors)[0].message;
    } else {
      // Handle other types of errors as before
      errorMessage = err.message || "Something went wrong";
    }
  
    const errorStatus = err.status || 500;
    res.status(errorStatus).json({ code: errorStatus, message: errorMessage, stack: err.stack });
  });

//connect to database
connecDb()
//listen the app
app.listen(port,(req,res)=>{
    console.log(`listening from the port ${port}`)
})