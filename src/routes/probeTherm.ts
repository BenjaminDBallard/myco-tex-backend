import { Router } from "express";
import { getProbeTherm, logProbeTherm } from "../controllers/probeTherm.js";
import { verifyJWT } from "../middleware/verifyJwt.js";

const router = Router();

router.get("/:probe_id/:hist/:from?/:to?", verifyJWT, getProbeTherm);
router.post("/new/:probe_id", logProbeTherm);

export default router;
