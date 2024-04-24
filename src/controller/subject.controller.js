import { Department } from "../model/department.model.js";
import { Subject } from "../model/subject.model.js";
import asyncHandler from "../utils/asyncHandler.js";


const createSubject = asyncHandler(async (req,res) => {
    const { name, code, credits } = req.body;

    if(name == "" || code == "" || credits == ""){
        return res.status(400).json({
            "success": false,
            "message": "all fields are required"
        })
    }

    const subject = await Subject.create({
        dept_id: req.user.dept_id,
        name,
        code,
        credits
    })

    if(!subject){
        return res.status(500).json({
            "success": false,
            "message":"error occured while creating subject"
        })
    }

    return res.status(200).json({
        "success": true,
        "data": subject,
        "message":"subject created successfully"
    })
})

export { createSubject }