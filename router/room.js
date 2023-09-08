const express = require("express")
const router = express.Router()
const {create,getSingle,getAll,update,deleteSingle,updateRoomAvailability,roomCount} = require("../controller/room")
const { verifyUser, verifyAdmin, verifyToken } = require("../utils/verify")


//all routes
router.post("/create/:hotelId",verifyAdmin, create)
 router.get("/:id",getSingle)
 router.get("/all/rooms",getAll)
 router.get("/count/all",roomCount)
 router.patch("/:id",verifyAdmin, update)
router.delete("/:id/:hotelId",verifyToken,verifyAdmin, deleteSingle)
router.patch("/unavialable/:id/",verifyToken,verifyAdmin, updateRoomAvailability)
module.exports = router