import { Router } from "express";
import { getProbeCo2, logProbeCo2 } from "../controllers/probeCo2.js";

const router = Router();

router.get("/:probe_id/probeCo2", getProbeCo2);
router.post("/:probe_id/probeCo2", logProbeCo2);

export default router;
