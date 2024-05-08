import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js"
import { createResult, getResult } from "../controller/examResult.controller.js";


const router = Router();

router.route("/create").post(verifyJWT, createResult)
router.route("/get-result").get(getResult)

export default router;