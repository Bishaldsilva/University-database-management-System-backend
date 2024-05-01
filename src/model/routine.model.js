import mongoose,{ Schema } from "mongoose";

const routineSchema = new Schema({
    teacher_id: {
        type: Schema.Types.ObjectId,
        ref: "Teacher"
    },
    day_of_week: {
        type: String,
        required: true
    },
    time_slot: {
        type: String,
        required: true
    },
    subject_id: {
        type: Schema.Types.ObjectId,
        ref: "Subject"
    },
    room_no: {
        type: String,
        required: true
    },
    dept_id: {
        type: Schema.Types.ObjectId,
        ref: "Department"
    },
    sem: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    }
}, {timestamps: true})

export const Routine = mongoose.model("Routine", routineSchema)