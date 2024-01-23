import { Router } from "express";
import { getReport, getMeasure } from "../controllers/api.js";
import { verifyJWT } from "../controllers/user.js";

const router = Router();

router.get("/report", verifyJWT, getReport);
router.get("/measure/:room_id/:hist", getMeasure);

export default router;
