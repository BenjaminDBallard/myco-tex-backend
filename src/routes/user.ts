import { Router } from "express";
import { logUser, login, getUser } from "../controllers/user.js";

const router = Router();

router.post("/", logUser);
router.get("/", getUser);
router.post("/login", login);

export default router;
