import { Department } from "../model/department.model.js";
import asyncHandler from "../utils/asyncHandler.js";


const createDepartment = asyncHandler(async (req, res) => {
    const { dept_name, branch } = req.body;

    const dept = await Department.create({
        dept_name, branch
    });

    if(!dept){
        return res.status(500).json({
            "success": false,
            "message":"error occured while creating department"
        })
    }

    return res.status(200).json({
        "success": true,
        "data": dept,
        "message":"department created successfully"
    })
})

const getDepartment = asyncHandler(async (req, res) => {
    let { dept_name, branch } = req.body;

    if(branch == "")
        branch = undefined

    const dept = await Department.findOne({ dept_name, branch });

    return res.status(200).json({
        "success": true,
        "data": dept
    })
})

export { createDepartment, getDepartment }