import { Router } from "express";
import { getProbe, logProbe } from "../controllers/probe.js";

const router = Router();

router.get("/:controller_id", getProbe);
router.post("/:controller_id", logProbe);

export default router;
