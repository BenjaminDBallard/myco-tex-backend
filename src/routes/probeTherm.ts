import { Router } from "express";
import { getProbeTherm, logProbeTherm } from "../controllers/probeTherm.js";

const router = Router();

router.get("/:probe_id/probeTherm", getProbeTherm);
router.post("/:probe_id/probeTherm", logProbeTherm);

export default router;
