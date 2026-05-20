import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

// REGISTER
export const register = async (req, res) => {
    const { email, password, role, nom, prenom } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email déjà utilisé" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: role || "etudiant", // Si role est fourni dans la requête, utilise-le. Sinon mets "etudiant" par défaut
            },
        });

        if (role === "etudiant" || !role) { //si le rôle envoyé est explicitement "etudiant" +  si aucun rôle n'est envoyé du tout (undefined, null, "")
            await prisma.etudiant.create({
                data: {
                    nom,
                    prenom,
                    email,
                    userId: user.id,
                },
            });
        }

        res.status(201).json({ message: "Compte créé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// LOGIN
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        const etudiant = await prisma.etudiant.findUnique({ where: { userId: user.id } });

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                nom: etudiant?.nom || '',
                prenom: etudiant?.prenom || '',
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};