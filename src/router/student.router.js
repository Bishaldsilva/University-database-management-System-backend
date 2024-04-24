import { 
    createStudent, 
    getAllDeptStudents, 
    getStudentById, 
    getStudentsBySemAndYear, 
    updateStudent 
} from "../controller/student.controller.js";
import { isHOD, verifyJWT } from "../middleware/auth.middleware.js";

import { Router } from "express";

const router = Router();

router.route("/create").post(verifyJWT, isHOD, createStudent);
router.route("/update/:id").post(verifyJWT, isHOD, updateStudent);
router.route("/profile/:id").get(verifyJWT, getStudentById);
router.route("/profile/:id").get(verifyJWT, getStudentById);
router.route("/get-all").get(verifyJWT, getAllDeptStudents);
router.route("/get-all-by-sem-year").get(verifyJWT, getStudentsBySemAndYear);

export default router;