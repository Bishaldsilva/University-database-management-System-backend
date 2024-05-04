import asyncHandler from "../utils/asyncHandler.js"
import { Student } from "../model/student.model.js"
import { Subject } from "../model/subject.model.js"
import { Attendance } from "../model/attendance.model.js";

const createAttendance = asyncHandler(async (req, res) => {
    const { roll_no, code, date, status } = req.body;

    if(roll_no == "" || code == "" || date == "" || status == ""){
        return res.status(400).json({
            "success": false,
            "message": "all fields are required"
        })
    }

    const student = await Student.findOne({ roll_no })
    if(!student){
        return res.status(400).json({
            "success": false,
            "message": "student with this roll no doesn't exist"
        })
    }

    const subject = await Subject.findOne({ code })
    if(!subject){
        return res.status(400).json({
            "success": false,
            "message": "subject with this code doesn't exist"
        })
    }

    if(student.dept_id.toString() != req.user.dept_id.toString() || subject.dept_id.toString() != req.user.dept_id.toString()){
        return res.status(400).json({
            "success": false,
            "message": "you are not authorized"
        })
    }

    const attendance = await Attendance.create({
        student_id: student._id,
        subject_id: subject._id,
        date: new Date(date), status
    })
    if(!attendance){
        return res.status(500).json({
            "success": false,
            "message": "something went wrong while creating the attendance"
        })
    }

    return res.status(200).json({
        "success": true,
        attendance,
        "message": "attendance created successfully"
    })
})

const getAttendanceBySemAndYear = asyncHandler(async (req, res) => {

    const { sem, year, date } = req.body;

    if(sem == "" || year == "" || date == ""){
        return res.status(400).json({
            "success": false,
            "message": "all fields are required"
        })
    }
    const attendances = await Attendance.aggregate([
        {
          $lookup: {
            from: "students",
            localField: "student_id",
            foreignField: "_id",
            as: "student"
          }
        },
        {
          $lookup: {
            from: "subjects",
            localField: "subject_id",
            foreignField: "_id",
            as: "subject"
          }
        },
        {
          $addFields: {
                student: {
                $arrayElemAt: ["$student.name", 0]
              },
                sem: {
                $arrayElemAt: ["$student.sem", 0]
              },
                year: {
                $arrayElemAt: ["$student.year", 0]
              },
              dept_id: {
                $arrayElemAt: ["$student.dept_id", 0]
              },
                subject: {
                $arrayElemAt: ["$subject.name", 0]
              }
          }
        },
        {
            $match: {
              sem: parseInt(sem),
              year: parseInt(year),
              dept_id: req.user.dept_id,
              date: new Date(date)
            }
        },
        {
          $project: {
            student: 1,
            subject: 1,
            date: 1,
            dept_id: 1
          }
        }
      ])

    if(attendances.length == 0){
        return res.status(400).json({
            "success": false,
            "message": "no atendance found"
        })
    }

    return res.status(200).json({
        "success": true,
        attendances
    })
})

export {
    createAttendance,
    getAttendanceBySemAndYear
}