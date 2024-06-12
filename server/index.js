// on appelle la librairy express
const express = require("express");
// choix du port
const port = 5000;

const app = express();

app.get("/", (request, response) => {
  response.send("Bienvenue sur notre API du club de pétanque !");
  });
  // On renvoi l'en tête Access-Control-Allow-Origin, en acceptant toutes les origines (possibilité de mettre http://localhost:5173)
  app.use((request, response, next) => {
    //Middleware
  response.header("Access-Control-Allow-Origin", "*");
  next();
});
// On va utiliser les modules que l'on a exporté
const membres = require("./routes/membres");
app.use("/membres", membres);
const users = require("./routes/users");
app.use("/users", users);

// Middleware pour les routes non trouvées (404)
app.use((req, res, next) => {
  res.status(404).json({ error: "Page not found." });
});

app.listen(port, () => {
  console.log("Server is online !");
});
