// on appelle la librairy express
const express = require("express");
// création d'un router
const router = express.Router();
// pour le hashage du mdp
const bcrypt = require("bcrypt");
const verifyToken = require("../middlewares/authMiddleware");
const connection = require("../database/connection");

// pour afficher les  users
router.get("/", (request, response) => {
  // Requête
  connection.query("SELECT * FROM user", (error, rows, fields) => {
    if (error) {
      throw error;
    }
    if (rows.length === 0) {
      response.status(404).json({ error: "utilisateurs non trouvé." });
    } else {
      response.json(rows);
    }
  });
  // Fermeture connection
  //   connection.end();
});
// pour afficher un user
router.get("/:id", (request, response) => {
  const id = request.params.id;
  // Requête
  connection.query(
    "SELECT * FROM user where id= ?",
    [id],
    (error, rows, fields) => {
      if (error) {
        throw error;
      }
      if (rows.length === 0) {
        response.status(404).json({ error: "Utilisateur non trouvé." });
      } else {
        response.json(rows);
      }
    }
  );
  // Fermeture connection
  //   connection.end();
});
router.get("/name/:name", (request, response) => {
  const name = request.params.name;
  connection.query(
    "SELECT * FROM user where name = ?",
    [name],
    (error, rows, fields) => {
      if (error) {
        throw error;
      }
      if (rows.length === 0) {
        response.status(200).json({ exists: false });
      } else {
        response.json(rows);
      }
    }
  );
});

router.post("/",verifyToken, async (request, response) => {
  const { name, password } = request.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    connection.query(
      "INSERT INTO user (name,password) VALUES (?,?)",
      [name, hashedPassword],
      (error, result) => {
        if (error) {
          console.log("Erreur lors de l'insertion de l'utilisateur:", error);
          response
            .status(500)
            .json({
              error:
                "Erreur interne du serveur lors de la création de l'utilisateur.",
            });
        } else {
          response
            .status(201)
            .json({ message: "Utilisateur créé avec succès." });
        }
      }
    );
  } catch (error) {
    console.log("Erreur lors du hachage du mot de passe:", error);
    response
      .status(500)
      .json({
        error: "Erreur interne du serveur lors du hachage du mot de passe.",
      });
  }
});
// Pour supprimer un users
// Pour modifier ?

// Permet d'exporter le module pour être réutilisable dans un autre fichier
module.exports = router;
