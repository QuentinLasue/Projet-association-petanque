// on appelle la librairy express
const express = require("express");
// on appelle la librairy mysql
const mysql = require("mysql");
// création d'un router
const router = express.Router();
// pour le hashage du mdp et l'access token
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
//pour accéder au variable d'environement 
require('dotenv').config();

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

const SECRET_KEY = process.env.SECRET_KEY;

router.post("/", async (request, response) => {
  const { name, password } = request.body;

  // vérification si l'utilisateur existe
  try {
    connection.query('SELECT name, password FROM user WHERE name= ?',
        [name],
        async (error, rows, fields) => {
            if (error) {
              throw error;
            }
            // si pas d'utilisateur 
            if(rows.length === 0 ){
                return response.status(401).json({error: "Identifiant inconnu"})
            }
            const user = rows[0]; 
    
            // vérification du mot de pass 
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(!isPasswordValid){
                return response.status(401).json({error: "Mauvais mot de passe"});
            }
            // génération d'un token 
            const token = jwt.sign({userName: user.name}, SECRET_KEY,{ expiresIn:'6h'});
        
            //renvoyer le token 
            response.json({accessToken: token})
        }
    );

  } catch (error) {
    console.log('Erreur lors de la connexion à la base de données:', error);
    response.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Permet d'exporter le module pour être réutilisable dans un autre fichier
module.exports = router;
