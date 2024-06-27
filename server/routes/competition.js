// on appelle la library express
const express = require("express");
// Création d'un router,
const router = express.Router();
//import du middleware de vérification du token pour les routes protégé
const verifyToken = require("../middlewares/authMiddleware");
const connection = require("../database/connection");

router.post("/addCompetition", verifyToken, (request, response) => {
  const { type } = request.body;

  const currentDate = new Date().toISOString().slice(0,10);
  
  // insertion nouveau concours
  connection.query("INSERT INTO concours (date_concours, id_type) VALUES (?,?)",
      [currentDate, type],
      (error, result) =>{
        if (error) {
            console.log("Erreur lors de la création du concours : ", error);
            response.status(500).json({
              error:
                "Erreur interne du serveur lors de la création du concours.",
            });
          }
          const insertedId= result.insertId;

        response.status(201).json({
          message: 'Concours créé avec succès.',
          competitionId: insertedId,
        })
      }
  )
  });

// Permet d'exporter le module pour être réutilisable dans un autre fichier
module.exports = router;
