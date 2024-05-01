import asyncHandler from "../utils/asyncHandler.js"
import { Teacher } from "../model/teacher.model.js"
import { Subject } from "../model/subject.model.js"
import { Routine } from "../model/routine.model.js"


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
        sem, year
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

export {
    createRoutine
}