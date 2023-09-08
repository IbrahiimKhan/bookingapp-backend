const express = require("express")
const Hotel = require("../model/hotel")
const upload = require("../utils/multerconfig")
const fs = require('fs');
const imagePath = process.env.HOTEL_IMAGE_PATH
const removeFile = require("../utils/remove");
const Room = require("../model/room");
const { constants } = require("fs/promises");
//crate 
exports.create=async(req,res,next)=>{
console.log(req.files)
    if (!req.files) {
      return  res.status(400).json({message:"Photo is required"})      
        
    }
    const hotel = new Hotel({...req.body,photo:req.files[0]?.originalname})
    try {
        const savedHotel = await hotel.save()
    upload.single("photo")
        res.status(201).json({message:"hotel created successfully",data:savedHotel})      
    } catch (error) {
      next(error)
    }
}
//get 
exports.getSingle=async(req,res,next)=>{
    const id = req.params.id
    console.log(req.params.id,"dddd")
    try {
        const data = await Hotel.findOne({_id:id})
       const updatedData =  data.toObject()
       updatedData.photoUrl= imagePath +"\\" + updatedData.photo
        
        res.status(200).json({message:"hotel fetched successfully",data:updatedData})
    } catch (error) {
      next(error)
    }
}
//getAll 
exports.getAll = async (req, res, next) => {
    try {
        const { limit, offset, search, min, max, featured ,city} = req.query;
        let queryConditions = {
            cheapestRoom: { $gte: Number(min) || 1, $lte: Number(max) || 100000 }
        };

        if (featured === 'true') {
            queryConditions.featured = true;
        }
       
        if (search) {
            queryConditions.$or = [
                { name: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } }
            ];
        }
        const data = await Hotel.find(queryConditions).sort({createdAt:-1})
            .limit(Number(limit)||25)
            .skip(Number(offset)||0);

        const hotelsWithPhotoUrls = data.map(item => {
            return {
                ...item.toObject(),
                photoUrl: `${imagePath}/${item.photo}`
            };
        });

        if (hotelsWithPhotoUrls.length === 0) {
            return res.status(404).json({ message: "No hotels found" });
        }

        res.status(200).json({ message: "Hotels fetched successfully", data: hotelsWithPhotoUrls });
    } catch (error) {
        next(error);
    }
};
//update one
exports.update = async (req, res, next) => {
    const id = req.params.id;

    try {
        let updateFields = { ...req.body }; 
        if (req.files && req.files[0]) {
            const incomingUrl = req.files[0].originalname;
            updateFields.photo = incomingUrl;  
        }  
        // Update the hotel
        const savedHotel = await Hotel.findOneAndUpdate(
            { _id: id },
            { $set: updateFields },
            { new: true }
        );
        if (req.files && req.files[0]) {
        upload.single("photo")
        }
        res.status(201).json({ message: "Hotel updated successfully", savedHotel });
    } catch (error) {
        next(error);
    }
};

exports.countHotel = async (req, res, next) => {
    try {
     
    const totalHotel = await Hotel.countDocuments(); 
      res.status(200).json(totalHotel);
    } catch (err) {
     return res.status(500).sjon
    }
  };
exports.countByCity = async (req, res, next) => {
    console.log("called")
    const cities = req.query.cities.split(",");
    try {
      const list = await Promise.all(
        cities.map((city) => {
          return Hotel.countDocuments({ city: city });
        })
      );
      res.status(200).json(list);
    } catch (err) {
     return res.status(500).sjon
    }
  };
  exports.countByType = async (req, res, next) => {
    try {
      const hotelCount = await Hotel.countDocuments({ type: "hotel" });
      const apartmentCount = await Hotel.countDocuments({ type: "apartments" });
      const resortCount = await Hotel.countDocuments({ type: "resorts" });
      const villaCount = await Hotel.countDocuments({ type: "villas" });
      const cabinCount = await Hotel.countDocuments({ type: "cabins" });
  
      res.status(200).json([
        { type: "hotel", count: hotelCount },
        { type: "apartments", count: apartmentCount },
        { type: "resorts", count: resortCount },
        { type: "villas", count: villaCount },
        { type: "cabins", count: cabinCount },
      ]);
    } catch (err) {
      next(err);
    }
  };
//delte one
exports.deleteSingle=async(req,res)=>{
    const id = req.params.id
    try {
           await Hotel.findOneAndDelete({_id:id})
            res.status(200).json({message:"hotel deleted successully"})
    } catch (error) {
       res.status(500).json(error)
    }
}

//get all rooms of a single hotel

exports.getRooms=async (req,res,next)=>{
    const id = req.params.hotelId
    try {
        const hotel = await Hotel.findById(id).sort({createdAt:-1})
        const list = await Promise.all(

            hotel.rooms.map((room)=>{
                return Room.findById(room)
            })
        )
        return res.status(200).json({message:"room fetched Successfully",data:list})
    } catch (error) {
        next(error)
    }

}