// on appelle la librairy express
const express = require("express");
// on appelle la librairy mysql
const mysql = require("mysql");
// création d'un router
const router = express.Router();

// Connexion a la base de donnée
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "petanque",
});

// on se connecte
connection.connect((error) => {
  if (error) {
    console.error("Connection error : " + error.stack);
    return;
  }
  console.log("Connection success !");
});

// pour afficher les  users
router.get("/", (request, response) => {
  // Requête
  connection.query("SELECT * FROM user", (error, rows, fields) => {
    if (error) {
      throw error;
    }
    response.json(rows);
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
      response.json(rows);
    }
  );
  // Fermeture connection
  //   connection.end();
});
// pour ajouter un users
// Pour supprimer un users
// Pour modifier ?

// Permet d'exporter le module pour être réutilisable dans un autre fichier
module.exports = router;
