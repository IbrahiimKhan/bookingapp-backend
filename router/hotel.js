const express = require("express")
const router = express.Router()
const {create,getSingle,getAll,update,deleteSingle,countByCity,countByType,getRooms,countHotel} = require("../controller/hotel")
const { verifyUser, verifyAdmin, verifyToken } = require("../utils/verify")


//all routes
router.post("/create",verifyAdmin, create)
router.get("/:id",getSingle)
router.get("/countybycity/all",countByCity )
router.get("/all/hotels",getAll)
router.get("/count/all",countHotel)
router.patch("/:id",verifyToken, verifyAdmin, update)
router.delete("/:id",verifyToken,verifyAdmin, deleteSingle) 

router.get("/countbytype/all",countByType )
router.get("/rooms/all/:hotelId",getRooms)

module.exports = router