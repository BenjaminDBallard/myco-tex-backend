import { Router } from "express";
import { getProbePpm, logProbePpm } from "../controllers/probePpm.js";

const router = Router();

router.get("/:probe_id/:hist", getProbePpm);
router.post("/:probe_id", logProbePpm);

export default router;
