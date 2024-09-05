// on appelle la library express
const express = require("express");
// Création d'un router,
const router = express.Router();
//import du middleware de vérification du token pour les routes protégé
const verifyToken = require("../middlewares/authMiddleware");
const connection = require("../database/connection");

// création des participations (unique grace à la contrainte : ALTER TABLE participe ADD CONSTRAINT unique_participation UNIQUE (id_membre, id_concours))
router.post("/addParticipation", verifyToken, (request, response) => {
  const { id_membre, id_concours } = request.body;
  connection.query(
    "INSERT IGNORE INTO participe (id_membre, id_concours, nbr_partie, nbr_victoire) VALUES (?,?,0,0)",
    [id_membre, id_concours],
    (error, result) => {
      if (error) {
        console.log("Erreur lors de la création du concours : ", error);
        response.status(500).json({
          error: "Erreur interne du serveur lors de la création du concours.",
        });
      }else {
        response.status(200).json({message: "Participation ajoutée avec succés"})
      }
    }
  );
});

// suppression avec id concours
router.delete("/deleteConcours", verifyToken, (request, response) => {
  const { id } = request.body;
  connection.query(
    "DELETE FROM participe WHERE id_concours = ?",
    [id],
    (error, result) => {
      if (error) {
        console.log(
          "Erreur lors de la suppression des participations : ",
          error
        );
        response.status(500).json({
          error:
            "Erreur interne du serveur lors de la suppression des participations.",
        });
      } else {
        response
          .status(201)
          .json({ message: "Participations supprimées avec succès." });
      }
    }
  );
});
// suppression avec id membre
router.delete("/deleteMember", verifyToken, (request, response) => {
  const { id } = request.body;
  connection.query(
    "DELETE FROM participe WHERE id_membre = ?",
    [id],
    (error, result) => {
      if (error) {
        console.log(
          "Erreur lors de la suppression des participations : ",
          error
        );
        response.status(500).json({
          error:
            "Erreur interne du serveur lors de la suppression des participations.",
        });
      } else {
        response
          .status(201)
          .json({ message: "Participations supprimées avec succès." });
      }
    }
  );
});
// ajout de participation a une partie d'un concours
router.post("/addGame", verifyToken, (request, response)=>{
  const { id_membre, id_concours} = request.body;
  connection.query(
    "UPDATE participe SET nbr_partie = nbr_partie + 1 where id_membre = ? AND id_concours = ?",
    [id_membre, id_concours],
    (error, result) => {
      if (error) {
        console.log("Erreur lors de l'ajout de partie aux concours : ", error);
        response.status(500).json({
          error: "Erreur interne du serveur lors de la mise à jours des partie du concours.",
        });
      }else {
        response.status(200).json({message: "Partie ajouté avec succés."})
      }
    }
  )
})
// ajout de victoire a une partie 
router.post("/addWin", verifyToken, (request, response)=>{
  const { id_membre, id_concours} = request.body;
  connection.query(
    "UPDATE participe SET nbr_victoire = nbr_victoire + 1 where id_membre = ? AND id_concours = ?",
    [id_membre, id_concours],
    (error, result) => {
      if (error) {
        console.log("Erreur lors de l'ajout de victoire aux concours : ", error);
        response.status(500).json({
          error: "Erreur interne du serveur lors de la mise à jours des victoires du concours.",
        });
      }else {
        response.status(200).json({message: "Victoire ajouté avec succés."})
      }
    }
  )
})
// Permet d'exporter le module pour être réutilisable dans un autre fichier
module.exports = router;
