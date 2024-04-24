import { Router } from "express";
import { 
        loginTeacher, 
        registerTeacher, 
        logoutTeacher, 
        changePassword, 
        getCurrentUser
} from "../controller/teacher.controller.js";
import { isHOD, verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

router.route("/login").post(loginTeacher)

// secure route
router.route("/register").post(verifyJWT, isHOD ,registerTeacher)
router.route("/logout").post(verifyJWT, logoutTeacher)
router.route("/change-password").post(verifyJWT, changePassword)
router.route("/profile").get(verifyJWT, getCurrentUser)


export default router;