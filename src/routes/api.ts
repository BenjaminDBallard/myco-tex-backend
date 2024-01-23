import { Router } from "express";
import { getReport, getMeasure } from "../controllers/api.js";
import { verifyJWT } from "../middleware/verifyJwt.js";

const router = Router();

router.get("/report", verifyJWT, getReport);
router.get("/measure/:room_id/:hist", verifyJWT, getMeasure);

export default router;
