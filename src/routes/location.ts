import { Router } from "express";
import { getLocation, logLocation } from "../controllers/location.js";

const router = Router();

router.get("/:user_id", getLocation);
router.post("/:user_id", logLocation);

export default router;
