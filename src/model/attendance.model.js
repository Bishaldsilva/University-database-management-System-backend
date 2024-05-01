import mongoose,{ Schema } from "mongoose";

const attendanceSchema = new Schema({
    student_id: {
        type: Schema.Types.ObjectId,
        ref: "Student"
    },
    subject_id: {
        type: Schema.Types.ObjectId,
        ref: "Subject"
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        default: "p"
    }
}, {timestamps: true})

export const Attendance = mongoose.model("Attendance", attendanceSchema)