import asyncHandler from "../utils/asyncHandler.js"
import { Teacher } from "../model/teacher.model.js"
import { Subject } from "../model/subject.model.js"
import { Routine } from "../model/routine.model.js"
import { Department } from "../model/department.model.js"


const createRoutine = asyncHandler(async (req, res) => {
    const { teacher_code, day_of_week, time_slot, subject_code, room_no, sem, year } = req.body;

    if(teacher_code == "" || day_of_week == "" || time_slot == "" || subject_code == "" || room_no == "" || sem == "" || year == ""){
        return res.status(400).json({
            "success": false,
            "message": "all fields are required"
        })
    }

    const teacher = await Teacher.findOne({ code: teacher_code });
    const subject = await Subject.findOne({ code: subject_code });

    if(!teacher){
        return res.status(400).json({
            "success": false,
            "message": "teacher with this code doesn't exist"
        })
    }

    if(!subject){
        return res.status(400).json({
            "success": false,
            "message": "subject with this code doesn't exist"
        })
    }

    const routine = await Routine.create({
        teacher_id: teacher._id,
        day_of_week, time_slot,
        subject_id: subject._id,
        room_no,
        dept_id: req.user.dept_id,
        sem: parseInt(sem), 
        year: parseInt(year)
    })
    if(!routine){
        return res.status(500).json({
            "success": false,
            "message": "something went wrong while creating the routine"
        })
    }

    return res.status(200).json({
        "success": true,
        routine
    })
})

const getRoutineByDay = asyncHandler(async (req, res) => {
    const { day_of_week } = req.body;

    if(day_of_week == ""){
        return res.status(400).json({
            "success": false,
            "message": "all fields are required"
        })
    }
    const routine = await Routine.aggregate([
        {
          $match: {
            "day_of_week":day_of_week,
            "teacher_id": req.user._id
          }
        },
        {
          $lookup: {
            from: "subjects",
            localField: "subject_id",
            foreignField: "_id",
            as: "subject_details"
          }
        },
        {
          $addFields: {
            "subject_name": {
              $first: "$subject_details.name"
            }
          }
        },
        {
          $project: {
            subject_name: 1,
            time_slot: 1
          }
        }
      ])
    if(!routine){
        return res.status(400).json({
            "success": false,
            "message": "no routine available"
        })
    }

    return res.status(200).json({
        "success": true,
        routine
    })
})

const getRoutineBySemAndYear = asyncHandler(async (req, res) => {
    const { dept_name, branch, sem, year } = req.body;

    if(dept_name == "" || branch == "" || sem == "" || year == ""){
        return res.status(400).json({
            "success": false,
            "message": "all fields are required"
        })
    }

    const dept = await Department.findOne({ dept_name, branch })
    if(!dept){
        return res.status(400).json({
          "success": false,
          "message": "department with this name or branch doesn't exist"
        })
    }

    const routines = await Routine.aggregate([
      {
        $match: {
          "dept_id": dept._id,
          "sem": parseInt(sem),
          "year":parseInt(year)
        }
      },
      {
        $lookup: {
          from: "subjects",
          localField: "subject_id",
          foreignField: "_id",
          as: "subject_details"
        }
      },
      {
        $lookup: {
          from: "teachers",
          localField: "teacher_id",
          foreignField: "_id",
          as: "teacher_details"
        }
      },
      {
        $addFields: {
          "subject_name": {
            $first: "$subject_details.name"
          },
          "teacher_name": {
            $arrayElemAt: ["$teacher_details.name", 0]
          }
        }
      },
      {
        $project: {
          subject_name: 1,
          teacher_name: 1,
          time_slot: 1,
          day_of_week: 1,
        }
      }
    ])
    if(routines == []){
      return res.status(400).json({
        "success": false,
        "message": "no routine found"
      })
    }
    return res.status(200).json({
      "success": false,
      routines
    })
})

export {
    createRoutine,
    getRoutineByDay,
    getRoutineBySemAndYear
}