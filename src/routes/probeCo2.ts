import { Router } from "express";
import { getProbeCo2, logProbeCo2 } from "../controllers/probeCo2.js";

const router = Router();

router.get("/:probe_id/:hist", getProbeCo2);
router.post("/:probe_id", logProbeCo2);

export default router;
