import { Router } from "express";
import { getLocation, logLocation } from "../controllers/location.js";
const router = Router();
router.get("/:user_id/location", getLocation);
router.post("/:user_id/location", logLocation);
export default router;
