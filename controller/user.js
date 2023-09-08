const express = require("express")
const User = require("../model/auth")
const upload = require("../utils/multerconfig")
const fs = require('fs');
const imagePath = process.env.HOTEL_IMAGE_PATH
const removeFile = require("../utils/remove")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');

//get 
exports.getSingle=async(req,res,next)=>{
    const id = req.params.id
    try {
        const data = await User.findOne({_id:id}).select("-password")
        const updatedData =  data.toObject()
        updatedData.photoUrl= imagePath +"\\" + updatedData.photo
        res.status(200).json({message:"User fetched successfully",data:updatedData})
    } catch (error) {
       next(error)
    }
}
// //getAll 
exports.getAll = async (req, res,next) => {
    try {
      const data = await User.find().sort({createdAt:-1}).select({password:0});
        // Map over the array and add the photoUrl to each item
        const users = data.map(item => {
            return {
                ...item.toObject(), // Convert Mongoose object to plain object
                photoUrl: imagePath +"\\" + item.photo,
            };
        });
        res.status(200).json({ message: "Users fetched successfully", data: users });
    } catch (error) {
       next(error)
    }
}
//update one
exports.update = async (req, res,next) => {
  const id = req.params.id;
  const incomingUrl = req.files[0]?.originalname; // Using optional chaining to avoid errors if files array is empty

  try {
      let savedUser = null;
      if (incomingUrl) {
          // If incomingUrl exists, update photo along with other fields
          savedUser = await User.findOneAndUpdate(
              { _id: id },
              { $set: { ...req.body, photo: incomingUrl } },
              { new: true } 
          );
      } else {
          savedUser = await User.findOneAndUpdate(
              { _id: id },
              { $set: { ...req.body } },
              { new: true }
          );
      }

      if (!savedUser) {
          return res.status(404).json({ message: "User not found" });
      }

      res.status(201).json({ message: "User updated successfully", savedUser });
  } catch (error) {
     next(error)
  }
};
//delte one
exports.deleteSingle=async(req,res,next)=>{
    const id = req.params.id
    try {
           const data = await User.findOneAndDelete({_id:id})
           if (!data) {
          return  res.status(400).json({message:"User not found"})
            
           }
            res.status(200).json({message:"User deleted successully"})
    } catch (error) {
       next(error)
    }
}