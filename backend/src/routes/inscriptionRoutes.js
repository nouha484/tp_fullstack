import express from "express";
import {
    sinscrire,
    seDesinscrire,
    monInscription,
} from "../controllers/inscriptionController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, sinscrire);
router.delete("/", verifyToken, seDesinscrire);
router.get("/mon-inscription", verifyToken, monInscription);

export default router;