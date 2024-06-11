// on appelle la library express
const express = require("express");
// on appelle la librairy mysql
const mysql = require("mysql");
// Création d'un router,
const router = express.Router();

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
router.get("/", (request, response) => {
  // Requête
  connection.query("SELECT * FROM membre", (error, rows, fields) => {
    if (error) {
      throw error;
    }
    //   console.log("Data is : ", rows);
    response.json(rows);
  });
  // Fermeture connection
  //   connection.end();
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
      //   console.log("Data is : ", rows);
      response.json(rows);
    }
  );
  // Fermeture connection
  //   connection.end();
});

// Pour supprimer un membre
// pour modifier un membre

// Permet d'exporter le module pour être réutilisable dans un autre fichier
module.exports = router;
