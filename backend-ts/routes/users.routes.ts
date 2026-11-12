import { Router } from "express";

import {
  getMe,
  updateMe,
} from "../controllers/users.controller.js";

import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/me", authenticateToken, getMe);
router.put("/me", authenticateToken, updateMe);

export default router;