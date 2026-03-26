import express from "express";
import {
  createDeal,
  getDeals,
  updateDealStage,
  deleteDeal,
} from "../controllers/dealController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", createDeal);
router.get("/", getDeals);
router.put("/:id/stage", updateDealStage);
router.delete("/:id", deleteDeal);

export default router;
