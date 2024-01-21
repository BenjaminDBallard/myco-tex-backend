import { Router } from "express";
import { getProbeHum, logProbeHum } from "../controllers/probeHum.js";

const router = Router();

router.get("/:probe_id/:hist", getProbeHum);
router.post("/:probe_id", logProbeHum);

export default router;
