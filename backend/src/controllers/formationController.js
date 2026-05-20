import prisma from "../lib/prisma.js";

// GET toutes les formations
export const getFormations = async (req, res) => {
    try {
        const formations = await prisma.formation.findMany();
        res.json(formations);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// GET une formation par id
export const getFormationById = async (req, res) => {
    const { id } = req.params;
    try {
        const formation = await prisma.formation.findUnique({
            where: { id: parseInt(id) },
        });
        if (!formation) {
            return res.status(404).json({ message: "Formation introuvable" });
        }
        res.json(formation);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// POST créer une formation (admin)
export const createFormation = async (req, res) => {
    const { titre, duree } = req.body;
    try {
        const formation = await prisma.formation.create({
            data: { titre, duree },
        });
        res.status(201).json(formation);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// PUT modifier une formation (admin)
export const updateFormation = async (req, res) => {
    const { id } = req.params;
    const { titre, duree } = req.body;
    try {
        const formation = await prisma.formation.update({
            where: { id: parseInt(id) },
            data: { titre, duree },
        });
        res.json(formation);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// DELETE supprimer une formation (admin)
export const deleteFormation = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.formation.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: "Formation supprimée" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};