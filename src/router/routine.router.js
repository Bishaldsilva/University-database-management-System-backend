import { Router } from "express"
import { verifyJWT, isHOD } from "../middleware/auth.middleware.js"
import { createRoutine } from "../controller/routine.controller.js"


const router= Router()

router.route("/create").post(verifyJWT, isHOD, createRoutine)

export default router;