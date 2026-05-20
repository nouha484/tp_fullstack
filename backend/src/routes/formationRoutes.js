import express from "express";
import {
    getFormations,
    getFormationById,
    createFormation,
    updateFormation,
    deleteFormation,
} from "../controllers/formationController.js";
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public - tout le monde peut voir les formations
router.get("/", verifyToken, getFormations);
router.get("/:id", verifyToken, getFormationById);

// Admin seulement
router.post("/", verifyToken, verifyAdmin, createFormation);
router.put("/:id", verifyToken, verifyAdmin, updateFormation);
router.delete("/:id", verifyToken, verifyAdmin, deleteFormation);

export default router;