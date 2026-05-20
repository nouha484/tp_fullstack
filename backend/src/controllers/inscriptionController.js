import prisma from "../lib/prisma.js";

// S'inscrire à une formation
export const sinscrire = async (req, res) => {
    const { formationId } = req.body;
    const userId = req.user.id;

    try {
        const etudiant = await prisma.etudiant.findUnique({
            where: { userId },
        });

        if (!etudiant) {
            return res.status(404).json({ message: "Etudiant introuvable" });
        }

        // Vérifier si déjà inscrit
        const dejaInscrit = await prisma.inscription.findUnique({
            where: { etudiantId: etudiant.id },
        });

        if (dejaInscrit) {
            return res.status(400).json({
                message: "Déjà inscrit à une formation, retirez-vous d'abord",
            });
        }

        const inscription = await prisma.inscription.create({
            data: {
                etudiantId: etudiant.id,
                formationId: parseInt(formationId),
            },
        });

        res.status(201).json(inscription);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// Se désinscrire
export const seDesinscrire = async (req, res) => {
    const userId = req.user.id;

    try {
        const etudiant = await prisma.etudiant.findUnique({
            where: { userId },
        });

        if (!etudiant) {
            return res.status(404).json({ message: "Etudiant introuvable" });
        }

        await prisma.inscription.delete({
            where: { etudiantId: etudiant.id },
        });

        res.json({ message: "Désinscription réussie" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// Voir mon inscription
export const monInscription = async (req, res) => {
    const userId = req.user.id;

    try {
        const etudiant = await prisma.etudiant.findUnique({
            where: { userId },
        });

        const inscription = await prisma.inscription.findUnique({
            where: { etudiantId: etudiant.id },
            include: { formation: true },
        });

        if (!inscription) {
            return res.status(404).json({ message: "Aucune inscription trouvée" });
        }

        res.json(inscription);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};