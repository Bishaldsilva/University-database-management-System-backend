import mongoose, { Schema } from "mongoose"

const subjectSchema = new Schema({
    dept_id: {
        type: Schema.Types.ObjectId,
        ref: "Department"
    },
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    credits: {
        type: Number,
        required: true
    }
},{timestamps: true})

export const Subject = mongoose.model("Subject", subjectSchema);