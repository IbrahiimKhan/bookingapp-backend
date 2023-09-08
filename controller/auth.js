const express = require("express")
const User = require("../model/auth")
const upload = require("../utils/multerconfig")
const fs = require('fs');
const imagePath = process.env.HOTEL_IMAGE_PATH
const removeFile = require("../utils/remove")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
//crate 
exports.create=async(req,res,next)=>{
    try
     {
       if (!req.files) {
         return res.status(400).json({error:"Photo is required"})
        }
        const file =await req.files[0].originalname
      //hashing the password
      if (!req.body.password) {
        res.status(400).json({error:"Password is required"})
      }
     const hash =  await bcrypt.hash(req.body.password, bcrypt.genSaltSync(10));
     req.body.password = hash
      const user = new User({...req.body,photo:file})
        const exising =await User.findOne({phone:req.body.phone})
        if (exising) {
          return  res.status(409).json({error:"Phone Number Already Exists"}) 
        }
        const savedUser = await user.save()
        upload.single("photo")
      return  res.status(201).json({message:"User created successfully",savedUser})      
    } catch (error) {
      next(error)
      }
}
//login
exports.login = async (req, res,next) => {
  try {
    if (!req.body.phone) {
      return res.status(400).json({ error: "Phone is required" });
    }  
    if (!req.body.password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const existingUser = await User.findOne({ phone: req.body.phone });

    if (!existingUser) {
      return res.status(400).json({ error: "Phone doesn't exist" });
    }
    
    const passwordMatch = await bcrypt.compare(req.body.password, existingUser.password);
    
    if (!passwordMatch) {
      return res.status(400).json({ error: "Password did not match" });
    }
    
    // Convert the Mongoose document to a plain JavaScript object
    const userObject = existingUser.toObject();  
    const token = jwt.sign(
      { id: userObject._id, isAdmin: userObject.isAdmin },
     `${process.env.JWT}`
      );
    userObject.photoURL = imagePath + '/' + userObject.photo;
    delete userObject.password;

    return res.cookie("access_token",token,{
      httpOnly:true,
    }).status(200).json({ message: "User Fetched successfully", token: token, data: userObject });
  } catch (error) {
    return next(error)
  }
};
