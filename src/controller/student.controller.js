import { Student } from "../model/student.model.js";
import asyncHandler from "../utils/asyncHandler.js"

const createStudent = asyncHandler(async (req, res) => {

    const { name, email, sem, year, roll_no } = req.body;
    if(name == "" || email == "" || sem == "" || year == "" || roll_no == ""){
        return res.status(400).json({
            "success": false,
            "message": "all fields are required"
        })
    }

    const student = await Student.create({
        dept_id: req.user.dept_id,
        name, email,
        sem: parseInt(sem),
        year: parseInt(year),
        roll_no
    })
    if(!student){
        return res.status(500).json({
            "success": false,
            "message": "An error occured while creating the student"
        })
    }

    return res.status(200).json({
        "success": true,
        "data": student,
        "message": "student details inserted successfully"
    })
})

const updateStudent = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { name, email, sem, year, roll_no } = req.body;

    const stu = await Student.findById(id);
    if(!stu){
        return res.status(400).json({
            "success": false,
            "message": "student doesn't exist"
        })
    }

    if(stu.dept_id !== req.user.dept_id){
        return res.status(400).json({
            "success": false,
            "message": "You are not allowed to change details of the students residing in other departments"
        })
    }

    const student = await Student.findByIdAndUpdate(
        id,
        {
            $set: {
                name, email, 
                sem: parseInt(sem),
                year: parseInt(year),
                roll_no
            }
        },
        {
            new: true
        }
    )
    if(!student){
        return res.status(500).json({
            "success": false,
            "message": "error while updating the student"
        })
    }


    return res.status(200).json({
        "success": true,
        "data": student,
        "message": "student updated successfully"
    })
})

const getStudentById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const stu = await Student.findById(id);
    if(!stu){
        return res.status(400).json({
            "success": false,
            "message": "student doesn't exist"
        })
    }

    return res.status(200).json({
        "success": true,
        "data": stu
    })
})

const getAllDeptStudents = asyncHandler(async (req, res) => {
    const students = await Student.find({ dept_id: req.user.dept_id });
    if(!students){
        return res.status(500).json({
            "success": false,
            "message": "error occured while fetching students"
        })
    }

    return res.status(200).json({
        "success": true,
        "data": students
    })
})

const getStudentsBySemAndYear = asyncHandler(async (req, res) => {
    const { sem, year } = req.body;
    if(!sem || sem == "" || !year || year == ""){
        return res.status(400).json({
            "success": false,
            "message": "all fields are required"
        })
    }

    const students = await Student.find({ 
        dept_id: req.user.dept_id,
        sem: parseInt(sem),
        year: parseInt(year)
    });
    if(!students){
        return res.status(500).json({
            "success": false,
            "message": "error occured while fetching students"
        })
    }

    return res.status(200).json({
        "success": true,
        "data": students
    })
})

export {
    createStudent,
    updateStudent,
    getStudentById,
    getAllDeptStudents,
    getStudentsBySemAndYear
}