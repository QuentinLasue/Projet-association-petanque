// on appelle la library express
const express = require("express");
// Création d'un router,
const router = express.Router();
//import du middleware de vérification du token pour les routes protégé
const verifyToken = require("../middlewares/authMiddleware");
const connection = require("../database/connection");

router.post("/addCompetition", verifyToken, (request, response) => {
  const { type } = request.body;

  const currentDate = new Date().toISOString().slice(0, 10);

  // insertion nouveau concours
  connection.query(
    "INSERT INTO concours (date_concours, id_type) VALUES (?,?)",
    [currentDate, type],
    (error, result) => {
      if (error) {
        console.log("Erreur lors de la création du concours : ", error);
        response.status(500).json({
          error: "Erreur interne du serveur lors de la création du concours.",
        });
      }
      const insertedId = result.insertId;

      response.status(201).json({
        message: "Concours créé avec succès.",
        competitionId: insertedId,
      });
    }
  );
});

router.delete("/delete", verifyToken, (request, response) => {
  const { id } = request.body;
  // démarrage de la transaction
  connection.beginTransaction((error) => {
    if (error) {
      return response.status(500).json({ error: "Transaction échoué." });
    }
    // supression des occurences dans la table participe
    connection.query(
      "DELETE FROM participe WHERE id_concours = ?",
      [id],
      (error, result) => {
        if (error) {
          return connection.rollback(() => {
            console.log(
              "Erreur lors de la suppression des participations du concours : ",
              error
            );
            response.status(500).json({ error: "suppression échoué." });
          });
        }
      }
    );
    // suppression du concours
    connection.query(
      "DELETE FROM concours WHERE id_concours = ?",
      [id],
      (error, result) => {
        if (error) {
          console.log("Erreur lors de la suppression du concours : ", error);
          response.status(500).json({
            error: "Erreur lors de la suppression du concours.",
          });
        }
      }
    );
    // validation de la transaction
    connection.commit((error) => {
      if (error) {
        return connection.rollback(() => {
          response.status(500).json({ error: "Transaction commit échoué." });
        });
      }
      response
        .status(200)
        .json({
          message: "Suppression du concours et de ses participations réussi.",
        });
    });
  });
});

// Permet d'exporter le module pour être réutilisable dans un autre fichier
module.exports = router;
