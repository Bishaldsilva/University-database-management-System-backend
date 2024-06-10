import asyncHandler from "../utils/asyncHandler.js"
import { Student } from "../model/student.model.js"
import { Subject } from "../model/subject.model.js"
import { ExamResult } from "../model/examResult.model.js";

const createResult = asyncHandler(async (req, res) => {
    const { roll_no, code, exam_date, score, sem, year } = req.body;

    if(roll_no == "" || code == "" || exam_date == "" || score == "" || sem == "" || year == ""){
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

    const result = await ExamResult.create({
        student_id: student._id,
        subject_id: subject._id,
        exam_date: new Date(exam_date),
        score: Number(score),
        sem: Number(sem),
        year: Number(year),
        isPassed: Number(score) >= 50
    })
    if(!result){
        return res.status(500).json({
            "success": false,
            "message": "something went wrong while creating the result"
        })
    }

    return res.status(200).json({
        "success": true,
        result,
        "message": "result created successfully"
    })
})

const getResult = asyncHandler(async(req, res) => {

    const { roll_no, sem, year } = req.body;

    if(roll_no == "" || sem == "" || year == ""){
        return res.status(400).json({
            "success": false,
            "message": "all fields are required"
        })
    }

    const result = await ExamResult.aggregate([
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
                  $arrayElemAt: ["$student.roll_no", 0]
            },
            subject: {
              $arrayElemAt: ["$subject", 0]
            }
          }
        },
        {
          $match: {
            student: roll_no,
            sem: Number(sem),
            year: Number(year)
          }
        },
        {
          $project: {
            subject: 1,
            score: 1,
            exam_date: 1
          }
        }
    ])

    if(result.length == 0){
      return res.status(400).json({
          "success": false,
          "message": "result doesn't exist"
      })
  }

    const cgpa = await ExamResult.aggregate([
        {
          $lookup: {
            from: "students",
            localField: "student_id",
            foreignField: "_id",
            as: "student"
          }
        },
        {
          $addFields: {
            student: {
                  $arrayElemAt: ["$student.roll_no", 0]
            }
          }
        },
        {
          $match: {
            student: roll_no,
            sem: Number(sem),
            year: Number(year)
          }
        },
        {
          $group: {
            _id: null,
            cgpa: {
              $avg: "$score"
            }
          }
        }
      ])

    const percentage = cgpa[0]?.cgpa

    return res.status(200).json({
        "success": true,
        result,
        percentage
    })
})

export {
    createResult,
    getResult
}