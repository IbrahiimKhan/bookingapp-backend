const jwt =  require( "jsonwebtoken")
const {createError} = require("./error")
exports.verifyToken=async (req,res,next)=>{
    const token = req.cookies.access_token
    if (!token) {
        return next(createError(401,"You are not authenticated"))
    }
    jwt.verify(token,process.env.JWT,(err,user)=>{
         if (err) {
        return next(createError(403,"Token is not valid"))
         }
         req.user=user
         next()
    })
} 
exports.verifyUser= async(req,res,next)=>{
    this.verifyToken(req,res, ()=>{
        if (req.user.id===req.params.id || req.user.isAdmin) {
            next()
        }
        else{
        return next(createError(403,"You are not authorized."))

        }
    })
}
exports.verifyAdmin = async(req, res, next) => {
    this.verifyToken(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        return next(createError(403, "You are not authorized!"));
      }
    });
  };