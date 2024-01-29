import { Router } from "express";
import { getProbePpm, logProbePpm } from "../controllers/probePpm.js";
import { verifyJWT } from "../middleware/verifyJwt.js";

const router = Router();

router.get("/:probe_id/:hist/:from?/:to?", verifyJWT, getProbePpm);
router.post("/new/:probe_id", logProbePpm);

export default router;
