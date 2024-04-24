import { Router } from "express";
import { createSubject } from "../controller/subject.controller.js";
import { verifyJWT, isHOD } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/create").post(verifyJWT, isHOD, createSubject);

export default router;