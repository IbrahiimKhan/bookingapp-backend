const express = require("express")
const router = express.Router()
const {getSingle,getAll,update,deleteSingle} = require("../controller/user")
const {verifyUser, verifyAdmin} = require("../utils/verify")
//all routes
 router.get("/:id",verifyUser,getSingle)
 router.get("/all/users",verifyAdmin, getAll)
 router.patch("/:id",verifyUser,update)
 router.delete("/:id",verifyAdmin,deleteSingle)
module.exports = router