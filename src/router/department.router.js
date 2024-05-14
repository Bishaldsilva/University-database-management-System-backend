import { Router } from "express";
import { createDepartment, getDepartment } from "../controller/department.controller.js";

const router = Router()

// router.route("/create").post(createDepartment)
router.route("/get").get(getDepartment)

export default router