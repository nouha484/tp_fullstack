import express from "express";
import {
    sinscrire,
    seDesinscrire,
    mesInscriptions,
    getInscritsByFormation,
} from "../controllers/inscriptionController.js";
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/mes-inscriptions", verifyToken, mesInscriptions);
router.get("/formation/:formationId", verifyToken, verifyAdmin, getInscritsByFormation);
router.post("/", verifyToken, sinscrire);
router.delete("/", verifyToken, seDesinscrire);

export default router;