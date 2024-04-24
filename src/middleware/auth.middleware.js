import { Teacher } from "../model/teacher.model.js"
import asyncHandler from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"

const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

    if(!token){
        return res.status(400).json({
            "success": false,
            "message": "You are not logged in."
        })
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await Teacher.findById(decoded._id).select("-password");

    if(!user){
        return res.status(400).json({
            "success": false,
            "message": "Invalid Access Token"
        })
    }

    req.user = user;
    next();
})

const isHOD = asyncHandler(async (req, res, next) => {
    if(!req.user.is_hod){
        return res.status(400).json({
            "success": false,
            "message": "You are not authorized to access."
        })
    }
    next();
})

export { verifyJWT, isHOD }