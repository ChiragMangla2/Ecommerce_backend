const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const isSignin = async (req,res,next) => {
    try {
        
        const decode_id = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);

        req.user = decode_id;

        next();
    } catch (error) {
        console.log(error);
    }
}

const isAdmin = async (req,res,next) => {
    try {
        const data = await userModel.findById(req.user._id);
        if(data.role != 1){
            return res.status(401).send({
                success:false,
                message:"UnAuthorized Access"
            })
        }else{
            next();
        }

    } catch (error) {
        return res.status(401).send({
            success:false,
            error,
            message:"Error is Admin Middleware"
        })
    }
}

module.exports = {
    isSignin,
    isAdmin
}