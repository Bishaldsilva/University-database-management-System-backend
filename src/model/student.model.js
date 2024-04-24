import mongoose, { Schema } from "mongoose"

const studentSchema = new Schema({
    dept_id: {
        type: Schema.Types.ObjectId,
        ref: "Department"
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    sem: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    roll_no: {
        type: String,
        required: true,
        unique: true
    }
},{timestamps: true})

export const Student = mongoose.model("Student", studentSchema);