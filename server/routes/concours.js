// on appelle la library express
const express = require("express");
// Création d'un router,
const router = express.Router();
//import du middleware de vérification du token pour les routes protégé
const verifyToken = require("../middlewares/authMiddleware");
const connection = require("../database/connection");


// Permet d'exporter le module pour être réutilisable dans un autre fichier
module.exports = router;