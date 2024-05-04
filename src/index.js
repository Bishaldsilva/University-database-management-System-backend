import express from "express"
import dotenv from "dotenv"
import connectDb from "./db/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"

dotenv.config()

const app = express()
connectDb();

app.use(cors())
app.use(express.json())
app.use(cookieParser())

// routers
import departmentRouter from "./router/department.router.js"
import subjectRouter from "./router/subject.router.js"
import teacherRouter from "./router/teacher.router.js"
import studentRouter from "./router/student.router.js"
import enrollmentRouter from "./router/enrollment.router.js"
import routineRouter from "./router/routine.router.js"
import attendanceRouter from "./router/attendance.router.js"

app.use("/teacher",teacherRouter)
app.use("/department", departmentRouter)
app.use("/subject", subjectRouter)
app.use("/student", studentRouter)
app.use("/enrollment", enrollmentRouter)
app.use("/routine", routineRouter)
app.use("/attendance", attendanceRouter)



app.get("/",(req, res) => {
    return res.json({
        "data": "Hii"
    });
})

app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
})