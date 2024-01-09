import { Router } from "express";
import { getProbeHum, logProbeHum } from "../controllers/probeHum.js";

const router = Router();

router.get("/:probe_id/probeHum", getProbeHum);
router.post("/:probe_id/probeHum", logProbeHum);

export default router;
