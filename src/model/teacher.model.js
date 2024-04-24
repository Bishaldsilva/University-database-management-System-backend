import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const teacherSchema = new Schema({
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
    code: {
        type: String,
        required: true
    },
    is_hod: {
        type: Boolean,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},{timestamps: true})

teacherSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

teacherSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

teacherSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        name: this.name,
        email: this.email
    }, process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
}


export const Teacher = mongoose.model("Teacher",teacherSchema)