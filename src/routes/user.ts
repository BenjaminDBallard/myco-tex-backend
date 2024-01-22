import { Router } from "express";
import { logUser, login, getUser, updateUser } from "../controllers/user.js";

const router = Router();

router.post("/", logUser);
router.get("/:user_id", getUser);
router.put("/:user_id", updateUser);
router.post("/login", login);

export default router;
