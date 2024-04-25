import asyncHandler from "../utils/asyncHandler.js"
import { Student } from "../model/student.model.js"
import { Subject } from "../model/subject.model.js"
import { Enrollment } from "../model/enrollment.model.js"

const createEnrollment = asyncHandler(async (req, res) => {
    const { roll_no, code } = req.body;

    if(roll_no == "" || code == ""){
        return res.status(400).json({
            "success": false,
            "message": "all fields are required"
        })
    }

    const student = await Student.findOne({ roll_no });
    const subject = await Subject.findOne({ code });

    if(!student){
        return res.status(400).json({
            "success": false,
            "message": "student with this roll no doesn't exist"
        })
    }
    if(!subject){
        return res.status(400).json({
            "success": false,
            "message": "subject with this code doesn't exist"
        })
    }

    if(student.dept_id.toString() != req.user.dept_id.toString() || subject.dept_id.toString() != req.user.dept_id.toString()){
        console.log(student.dept_id, subject.dept_id, req.user.dept_id);
        return res.status(400).json({
            "success": false,
            "message": "you are not allowed to enroll this student with this subject"
        })
    }

    const enroll = await Enrollment.create({
        student_id: student._id,
        subject_id: subject._id,
        isActive: true
    })

    if(!enroll){
        return res.status(500).json({
            "success": false,
            "message": "An error occured while creating enrollment"
        })
    }

    return res.status(200).json({
        "success": true,
        "data": enroll,
        "message": "Enrollment completed successfully"
    })
})

const updateEnrollment = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const enroll = await Enrollment.findById(id);
    if(!enroll){
        return res.status(500).json({
            "success": false,
            "message": "An error occured while creating enrollment"
        })
    }

    const student = await Student.findById(enroll.student_id);
    const subject = await Subject.findById(enroll.subject_id);

    if(student.dept_id.toString() != req.user.dept_id.toString() || subject.dept_id.toString() != req.user.dept_id.toString()){
        console.log(student.dept_id, subject.dept_id, req.user.dept_id);
        return res.status(400).json({
            "success": false,
            "message": "you are not allowed to enroll this student with this subject"
        })
    }

    enroll.isActive = false;
    await enroll.save({ validateBeforeSave: true })

    return res.status(200).json({
        "success": true,
        "message": "Enrollment updated successfully"
    })
})

export {
    createEnrollment,
    updateEnrollment
}