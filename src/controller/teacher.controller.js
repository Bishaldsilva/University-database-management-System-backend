import { Teacher } from "../model/teacher.model.js";
import asyncHandler from "../utils/asyncHandler.js"

const registerTeacher = asyncHandler(async (req, res) => {

    const {name, email, code, password} = req.body;
    
    if(name == "" || email == "" || code == "" || password == ""){
        return res.status(400).json({
            "success": false,
            "message": "all fields are required"
        })
    }

    const teacher = await Teacher.create({
        dept_id: req.user.dept_id,
        name,
        email,
        code,
        is_hod: false,
        password
    })
    if(!teacher){
        return res.status(500).json({
            "success": false,
            "message": "error occured while registering teacher"
        })
    }

    const createdTeacher = await Teacher.findById(teacher._id).select("-password");
    return res.status(200).json({
        "success": true,
        "data": createdTeacher,
        "message": "teacher registered successfully"
    })
})

const loginTeacher = asyncHandler(async (req, res) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

    if(token){
        return res.status(400).json({
            "success": false,
            "message": "User already logged in. Please Logout to Login Again"
        })
    }

    const {email, password} = req.body;
    if(!email || email == ""){
        return res.status(400).json({
            "success": false,
            "message": "email required"
        })
    }

    const teacher = await Teacher.findOne({email});
    if(!teacher){
        return res.status(400).json({
            "success": false,
            "message": "teacher with this email do not exist"
        })
    }

    const confirmPassword = await teacher.isPasswordCorrect(password);
    if(!confirmPassword){
        return res.status(400).json({
            "success": false,
            "message": "Incorrect passord"
        })
    }

    const accessToken = teacher.generateAccessToken();
    const loggedInTeacher = await Teacher.findById(teacher._id).select("-password");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .json({
        "success": true,
        accessToken,
        "data": loggedInTeacher,
        "message": "teacher logged in successfully"
    })

})

const logoutTeacher = asyncHandler(async (req, res) => {
    const options = {
        httpOnly : true,
        secure: true
    }

    return res.status(200)
           .clearCookie("accessToken", options)
           .json({
                "success": true,
                "message":"teacher logout successfully"
           })
})

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if(oldPassword == "" || newPassword == ""){
        return res.status(400).json({
            "success": false,
            "message": "all fields are required"
        })
    }

    const user = await Teacher.findById(req.user._id);
    const correctPassword = await user.isPasswordCorrect(oldPassword);
    if(!correctPassword){
        return res.status(400).json({
            "success": false,
            "message": "Old Password is not correct"
        })
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false })

    return res.status(200).json({
        "success": true,
        "message": "Password changed successfully"
    })
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json({
        "success": true,
        "data": req.user
    })
})


export { 
        registerTeacher,
        loginTeacher,
        logoutTeacher,
        changePassword,
        getCurrentUser
}