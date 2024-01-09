import { Router } from "express";
import { getProbe, logProbe } from "../controllers/probe.js";

const router = Router();

router.get("/:controller_id/probe", getProbe);
router.post("/:controller_id/probe", logProbe);

export default router;
