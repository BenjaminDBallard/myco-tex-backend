import { Router } from "express";
import { getProbe, logProbe, updateProbe } from "../controllers/probe.js";

const router = Router();

router.get("/:controller_id", getProbe);
router.post("/:controller_id", logProbe);
router.put("/:probe_id", updateProbe);

export default router;
