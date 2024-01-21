import { Router } from "express";
import { getReport, getMeasure } from "../controllers/api.js";

const router = Router();

router.get("/report/:user_id", getReport);
router.get("/measure/:room_id/:hist", getMeasure);

export default router;
