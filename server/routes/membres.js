// on appelle la library express
const express = require("express");
// Création d'un router,
const router = express.Router();
//import du middleware de vérification du token pour les routes protégé
const verifyToken = require("../middlewares/authMiddleware");
const connection = require("../database/connection");

// Pour afficher tous les membres
// request ce que l'on reçois, response ce que l'on envoi
// get car on veut afficher, / pour racine de /membres
router.get("/", verifyToken, (request, response) => {
  // Requête
  connection.query("SELECT * FROM membre", (error, rows, fields) => {
    if (error) {
      throw error;
    }
    // Si l'élément n'existe pas
    if (rows.length === 0) {
      response.status(404).json({ error: "Membres non trouvé." });
    } else {
      response.json(rows);
    }
  });
});
// pour afficher un seul membre
router.get("/:numero", (request, response) => {
  const numero = request.params.numero;
  // Requête
  connection.query(
    "SELECT * FROM membre WHERE numero = ?",
    [numero],
    (error, rows, fields) => {
      if (error) {
        throw error;
      }
      // Si l'élément n'existe pas
      if (rows.length === 0) {
        response.status(404).json({ error: "Membres non trouvé." });
      } else {
        response.json(rows);
      }
    }
  );
});
// pour ajouter un membre
router.post("/addMember", verifyToken, (request, response) => {
  const { name, firstName, number } = request.body;
  try {
    // Vérifier si le membre avec ce numéro existe déjà
    connection.query(
      "SELECT * FROM membre WHERE numero = ?",
      [number],
      (error, rows, fields) => {
        if (error) {
          console.log("Erreur lors de la vérification du membre : ", error);
          return response.status(500).json({
            error:
              "Erreur interne du serveur lors de la vérification du membre.",
          });
        }
        if (rows.length > 0) {
          // Si un membre avec ce numéro existe déjà
          return response.status(400).json({
            error: "Un membre avec ce numéro existe déjà.",
          });
        } else {
          // Insertion nouveau membre
          connection.query(
            "INSERT INTO membre (numero,nom,prenom) VALUES (?,?,?)",
            [number, name, firstName],
            (error, result) => {
              if (error) {
                console.log("Erreur lors de l'insertion du membre : ", error);
                response.status(500).json({
                  error:
                    "Erreur interne du serveur lors de la création du membre.",
                });
              } else {
                response
                  .status(201)
                  .json({ message: "Membre ajouté avec succès." });
              }
            }
          );
        }
      }
    );
  } catch (error) {
    console.log("Erreur lors de l'ajout du membre :", error);
    response.status(500).json({
      error: "Erreur interne du serveur lors de l'ajout du membre.",
    });
  }
});
// pour modifier un membre
router.post("/updateMember", verifyToken, (request, response) => {
  const { nom, prenom, numero, oldNumero } = request.body;
  try {
    if(numero != oldNumero){
      // Vérifier si le membre avec ce numéro existe déjà
      connection.query(
        "SELECT * FROM membre WHERE numero = ?",
        [numero],
        (error, rows, fields) => {
          if (error) {
            console.log("Erreur lors de la vérification du membre : ", error);
            return response.status(500).json({
              error:
                "Erreur interne du serveur lors de la vérification du membre.",
            });
          }
          if (rows.length > 0) {
            // Si un membre avec ce numéro existe déjà
            return response.status(400).json({
              error: "Un membre avec ce numéro existe déjà.",
            });
          } else {
            connection.query(
              "UPDATE membre SET numero = ?, nom = ? , prenom = ? WHERE numero = ?",
              [numero, nom, prenom, oldNumero],
              (error, result) => {
                if (error) {
                  console.log(
                    "Erreur lors de la modification du membre : ",
                    error
                  );
                  response.status(500).json({
                    error:
                      "Erreur interne du serveur lors de la modification du membre.",
                  });
                } else {
                  response
                    .status(201)
                    .json({ message: "Membre ajouté avec succès." });
                }
              }
            );
          }
        }
      );
    }else{
      connection.query(
        "UPDATE membre SET numero = ?, nom = ? , prenom = ? WHERE numero = ?",
        [numero, nom, prenom, oldNumero],
        (error, result) => {
          if (error) {
            console.log(
              "Erreur lors de la modification du membre : ",
              error
            );
            response.status(500).json({
              error:
                "Erreur interne du serveur lors de la modification du membre.",
            });
          } else {
            response
              .status(201)
              .json({ message: "Membre ajouté avec succès." });
          }
        }
      );
    }
  } catch (error) {
    console.log("Erreur lors de la modification du membre :", error);
    response.status(500).json({
      error: "Erreur interne du serveur lors de la modification du membre.",
    });
  }
});
// Pour supprimer un membre
router.delete("/delete", verifyToken, (request, response) => {
  const { id_membre } = request.body;

  connection.beginTransaction((error) => {
    if (error) {
      return response.status(500).json({ error: "Transaction échoué." });
    }
    // supression des occurences dans la table participe
    connection.query(
      "DELETE FROM participe WHERE id_membre = ?",
      [id_membre],
      (error, result) => {
        if (error) {
          return connection.rollback(() => {
            console.log(
              "Erreur lors de la suppression des participations aux concours : ",
              error
            );
            response.status(500).json({ error: "suppression échoué." });
          });
        }
      }
    );
    // suppression du membre
    connection.query(
      "DELETE FROM membre WHERE id_membre = ? ",
      [id_membre],
      (error, result) => {
        if (error) {
          console.log("Erreur lors de la suppression du membre : ", error);
          response.status(500).json({
            error: "Erreur lors de la suppression du membre.",
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
        .status(201)
        .json({
          message: "Suppression du membre et de ses participations réussi.",
        });
    });
  });
});

// Pour la recherche dans la liste des membres
router.get("/search/liste", verifyToken, (request, response) => {
  const { searchValue } = request.query; // ou request.query pour get
  const searchPattern = `%${searchValue}%`;
  try {
    connection.query(
      "SELECT * FROM membre WHERE nom LIKE ? OR prenom LIKE ? OR numero LIKE ?",
      [searchPattern, searchPattern, searchValue],
      (error, rows) => {
        if (error) {
          return response
            .status(500)
            .json({ error: "Une erreur est survenue lors de la recherche." });
        }

        if (rows.length === 0) {
          return response.status(404).json({ error: "Aucun membre trouvé." });
        }
        response.json(rows);
      }
    );
  } catch (error) {
    console.log("Erreur lors de la recherche de membre : ", error);
    response.status(500).json({
      error: "Erreur interne du serveur lors de la recherche de membre.",
    });
  }
});

// Permet d'exporter le module pour être réutilisable dans un autre fichier
module.exports = router;
