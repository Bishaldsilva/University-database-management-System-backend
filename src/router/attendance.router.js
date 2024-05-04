import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js"
import { createAttendance, getAttendanceBySemAndYear } from "../controller/attendance.controller.js";


const router = Router();

router.route("/create").post(verifyJWT, createAttendance)
router.route("/get-by-sem-and-year").get(verifyJWT, getAttendanceBySemAndYear)

export default router;