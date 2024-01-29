import { Router } from "express";
import { getProbeCo2, logProbeCo2 } from "../controllers/probeCo2.js";
import { verifyJWT } from "../middleware/verifyJwt.js";

const router = Router();

router.get("/:probe_id/:hist/:from?/:to?", verifyJWT, getProbeCo2);
router.post("/new/:probe_id", logProbeCo2);

export default router;
