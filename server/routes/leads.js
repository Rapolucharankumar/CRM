import express from "express";
import {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  getDashboardStats,
  getFollowUps,
} from "../controllers/leadController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

router.post("/", createLead);
router.get("/", getLeads);
router.get("/stats/dashboard", getDashboardStats);
router.get("/followups/list", getFollowUps);
router.get("/:id", getLead);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);

export default router;
