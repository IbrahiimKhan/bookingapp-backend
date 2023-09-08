
const Room = require("../model/room")
const Hotel = require("../model/hotel")
const {createError} = require("../utils/error")
const upload = require("../utils/multerconfig")
const fs = require('fs');
const imagePath = process.env.HOTEL_IMAGE_PATH
const removeFile = require("../utils/remove")
//create
exports.create = async(req,res,next)=>{
    if (!req.files) {
    return    next(createError(400,"Room photo is required"))
    }
    const hotelId = req.params.hotelId
    const roomNumbersInput = req.body.rooms.split(","); 
    const roomNumbers = roomNumbersInput.map(number => ({ number: Number(number),  unavialableDates: [] }));
    const newRoom = new Room({
        ...req.body,
        photo: req.files[0].originalname,
        roomNumbers: roomNumbers
    });
    try {
        const savedRoom = await newRoom.save();
        
        try {
            await Hotel.findByIdAndUpdate(hotelId, { $push: { rooms: savedRoom._id } });
            upload.single("photo");
            res.status(201).json({ message: "Room created Successfully", data: savedRoom });
        } catch (error) {
            next(error);
        }
    } catch (error) {
        next(error);
    }
}
//get 
exports.getSingle=async(req,res,next)=>{
    const id = req.params.id
    try {
        const data = await Room.findOne({_id:id})
        const hotel = await Hotel.findOne({rooms:id})
       const updatedData =  data.toObject()
       updatedData.photoUrl= imagePath +"\\" + updatedData.photo
       updatedData.hotelInfo=hotel
        res.status(200).json({message:"Room fetched successfully",data:updatedData})
    } catch (error) {
        next(error)
        }
}
exports.roomCount=async(req,res,next)=>{
 try {  
        const data = await Room.countDocuments()
        res.status(200).json(data)
    } catch (error) {
        next(error)
    }
}
//getAll 
exports.getAll = async (req, res,next) => {
    try {
        const { limit, offset, search } = req.query;
        let query = Room.find();
        if (search) {
            query = query.or([
                { name: { $regex: search, $options: 'i' } },

            ]);
        }
        
        const data = await query.limit(Number(limit)||25).skip(Number(offset)||0);
        
        // Fetch hotels for each room asynchronously
        const roomWithPhotosPromises = data.map(async item => {
            const hotel = await Hotel.findOne({ rooms: item._id });
            return {
                ...item.toObject(),
                photoUrl: imagePath + "\\" + item.photo,
                hotelInfo: hotel ? hotel : 'No Hotel Associated',
            };
        });
        
        const roomWithPhotos = await Promise.all(roomWithPhotosPromises);

        res.status(200).json({ message: "Room fetched successfully", data: roomWithPhotos });
    } catch (error) {
       next(error)
    }
};

//update one
exports.update=async(req,res,next)=>{
    const id = req.params.id
    try {
        let updatedFields = {...req.body}
        if ( req.files && req.files[0]) {
            const incomingUrl = req.files[0].originalname;
            updatedFields.photo = incomingUrl; 
        }
        console.log(updatedFields)
           const savedRoom = await Room.findOneAndUpdate({_id:id}, { $set:updatedFields},{new:true})
           if (req.files && req.files[0]) {
            upload.single("photo")
            }
            res.status(201).json({message:"Room updated successfully",savedRoom})  
    } catch (error) {
       next(error)
    }
}
//delte one
exports.deleteSingle=async(req,res)=>{
    const {id,hotelId} = req.params
    try {
           await Room.findOneAndDelete({_id:id})
           try {
            await Hotel.findByIdAndUpdate(hotelId, {
              $pull: { rooms: req.params.id },
            });
          } catch (err) {
            next(err);
          }
            res.status(200).json({message:"Room deleted successully"})
    } catch (error) {
       res.status(500).json(error)
    }
}

//unavialable dates
exports.updateRoomAvailability = async (req, res, next) => {
    try {
        const room = await Room.findOne({ "roomNumbers._id": req.params.id });
        if (!room) {
            return res.status(404).json("Room not found.");
        }

        console.log("Found room:", room);

        await Room.updateOne(
            { "roomNumbers._id": req.params.id },
            {
                $push: {
                    "roomNumbers.$.unavialableDates": req.body.dates
                },
            }
        );

        res.status(200).json("Room status has been updated.");
    } catch (err) {
        console.error("Error:", err);
        next(err);
    }
};

