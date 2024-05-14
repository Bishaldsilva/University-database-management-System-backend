import { Router } from "express";
import { createEnrollment, getEnrollById, updateEnrollment } from "../controller/enrollment.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js"


const router = Router()

router.route("/create").post(verifyJWT, createEnrollment)
router.route("/update/:id").post(verifyJWT, updateEnrollment)
router.route("/:student_id").get(verifyJWT, getEnrollById)

export default router;