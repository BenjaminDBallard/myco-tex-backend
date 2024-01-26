import { Router } from "express";
import { getProbeHum, logProbeHum } from "../controllers/probeHum.js";
import { verifyJWT } from "../middleware/verifyJwt.js";

const router = Router();

router.get("/:probe_id/:hist", verifyJWT, getProbeHum);
router.post("/new/:probe_id", logProbeHum);

export default router;
