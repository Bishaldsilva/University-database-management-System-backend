import mongoose, { Schema } from "mongoose"


const enrollmentSchema = new Schema({
    student_id: {
        type:Schema.Types.ObjectId,
        ref: "Student"
    },
    subject_id: {
        type: Schema.Types.ObjectId,
        ref: "Subject"
    },
    isActive: {
        type: Boolean,
        required: true
    }
},{timestamps: true})

export const Enrollment = mongoose.model("Enrollment", enrollmentSchema)