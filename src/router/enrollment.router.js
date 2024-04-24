import { Router } from "express";
import { createEnrollment } from "../controller/enrollment.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js"


const router = Router()

router.post("/create").post(verifyJWT, createEnrollment)

export default router;