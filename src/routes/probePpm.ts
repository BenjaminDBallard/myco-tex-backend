import { Router } from "express";
import { getProbePpm, logProbePpm } from "../controllers/probePpm.js";

const router = Router();

router.get("/:probe_id/probePpm", getProbePpm);
router.post("/:probe_id/probePpm", logProbePpm);

export default router;
