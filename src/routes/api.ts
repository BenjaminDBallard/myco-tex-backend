import { Router } from "express";
import { getReport } from "../controllers/api.js";

const router = Router();

router.get("/report", getReport);

export default router;
