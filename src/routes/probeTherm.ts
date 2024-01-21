import { Router } from "express";
import { getProbeTherm, logProbeTherm } from "../controllers/probeTherm.js";

const router = Router();

router.get("/:probe_id/:hist", getProbeTherm);
router.post("/:probe_id", logProbeTherm);

export default router;
