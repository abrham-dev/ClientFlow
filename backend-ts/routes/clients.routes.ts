import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from "../controllers/clients.controller.js";

const router = Router();

router.get("/", authenticateToken, getClients);
router.post("/", authenticateToken, createClient);
router.put("/:id",  authenticateToken, updateClient);
router.delete("/:id", authenticateToken, deleteClient);
export default router;