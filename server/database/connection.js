// on appelle la librairy mysql
const mysql = require("mysql");

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

  // Permet d'exporter le module pour être réutilisable dans un autre fichier
module.exports = connection;