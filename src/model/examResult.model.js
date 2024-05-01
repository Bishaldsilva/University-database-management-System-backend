import mongoose,{ Schema } from "mongoose";

const examResultSchema = new Schema({
    student_id: {
        type: Schema.Types.ObjectId,
        ref: "Student"
    },
    subject_id: {
        type: Schema.Types.ObjectId,
        ref: "Subject"
    },
    exam_date: {
        type: Date,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    isPassed: {
        type: Boolean,
        required: true
    }
}, {timestamps: true})

export const ExamResult = mongoose.model("ExamResult", examResultSchema)