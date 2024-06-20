// on appelle la library express
const express = require("express");
// on appelle la librairy mysql
const mysql = require("mysql");
// Création d'un router,
const router = express.Router();
//import du middleware de vérification du token pour les routes protégé
const verifyToken = require("../middlewares/authMiddleware");

//Connexion à la database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "petanque",
});
//on se connecte
connection.connect((error) => {
  if (error) {
    console.error("Connection error : " + error.stack);
    return;
  }
  console.log("Connection success !");
});
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
    connection.query(
      "INSERT INTO membre (numero,nom,prenom) VALUES (?,?,?)",
      [number, name, firstName],
      (error, result) => {
        if (error) {
          console.log("Erreur lors de l'insertion du membre : ", error);
          response.status(500).json({
            error: "Erreur interne du serveur lors de la création du membre.",
          });
        } else {
          response.status(201).json({ message: "Membre ajouté avec succès." });
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
    connection.query(
      "UPDATE membre SET numero = ?, nom = ? , prenom = ? WHERE numero = ?",
      [numero, nom, prenom, oldNumero],
      (error, result) => {
        if (error) {
          console.log("Erreur lors de la modification du membre : ", error);
          response.status(500).json({
            error:
              "Erreur interne du serveur lors de la modification du membre.",
          });
        } else {
          response.status(201).json({ message: "Membre ajouté avec succès." });
        }
      }
    );
  } catch (error) {
    console.log("Erreur lors de la modification du membre :", error);
    response.status(500).json({
      error: "Erreur interne du serveur lors de la modification du membre.",
    });
  }
});
// Pour supprimer un membre
router.delete("/delete", verifyToken,(request, response)=>{
const {name, firstName,number}= request.body;
try {
  connection.query(
    "DELETE FROM membre WHERE numero = ? AND nom = ? AND prenom = ?",
    [number, name, firstName],
    (error, result)=>{
      if(error){
        console.log("Erreur lors de la suppression du membre : ", error);
        response.status(500).json({
          error:
            "Erreur interne du serveur lors de la suppression du membre.",
        });
      }else{
        response.status(201).json({ message: "Membre supprimé avec succès." });
      }
    }
  )
} catch (error) {
  console.log("Erreur lors de la suppression du membre : ", error);
  response.status(500).json({
    error:
      "Erreur interne du serveur lors de la suppression du membre.",
  });
}
})

// Permet d'exporter le module pour être réutilisable dans un autre fichier
module.exports = router;
