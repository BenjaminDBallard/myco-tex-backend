import { Router } from "express";
import { getProbeTherm, logProbeTherm } from "../controllers/probeTherm.js";

const router = Router();

router.get("/:probe_id", getProbeTherm);
router.post("/:probe_id", logProbeTherm);

export default router;
