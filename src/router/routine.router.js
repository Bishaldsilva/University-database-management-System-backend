import { Router } from "express"
import { verifyJWT, isHOD } from "../middleware/auth.middleware.js"
import { createRoutine, updateRoutine, getRoutineByDay, getRoutineBySemAndYear } from "../controller/routine.controller.js"


const router= Router()

router.route("/create").post(verifyJWT, isHOD, createRoutine)
router.route("/update/:id").post(verifyJWT, isHOD, updateRoutine)
router.route("/get-routine-by-day").get(verifyJWT, getRoutineByDay)
router.route("/get-routine-by-sem-and-year").get(getRoutineBySemAndYear)

export default router;