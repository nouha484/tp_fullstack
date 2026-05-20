import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import formationRoutes from "./routes/formationRoutes.js";
import inscriptionRoutes from "./routes/inscriptionRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);
app.use("/api/formations", formationRoutes);
app.use("/api/inscriptions", inscriptionRoutes);

app.get("/", (req, res) => {
    res.json({ message: "API Gestion Formations" });
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});