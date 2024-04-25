import { Router } from "express";
import { createEnrollment, updateEnrollment } from "../controller/enrollment.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js"


const router = Router()

router.route("/create").post(verifyJWT, createEnrollment)
router.route("/update").post(verifyJWT, updateEnrollment)

export default router;