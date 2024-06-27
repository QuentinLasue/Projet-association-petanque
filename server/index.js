// on appelle la librairy express
const express = require("express");
// on appelle le package cors pour permettre les requéte depuis notre front
const cors = require("cors");
const bodyParser = require("body-parser");
// choix du port
const port = 5000;

const app = express();
// configuration des options CORS
const corsOptions = {
  origin: "http://localhost:5173", // origine de notre front
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"], // Ajoutez les en-têtes nécessaires ici
};
// Utilisation de CORS avec les options spécifié
app.use(cors(corsOptions));
app.use(bodyParser.json()); //Middleware pour parser le JSON necessaire pour requéte POST
app.get("/", (request, response) => {
  response.send("Bienvenue sur notre API du club de pétanque !");
});
//   // On renvoi l'en tête Access-Control-Allow-Origin, en acceptant toutes les origines (possibilité de mettre http://localhost:5173)
//   app.use((request, response, next) => {
//     //Middleware
//   response.header("Access-Control-Allow-Origin", "*");
//   next();
// });
// On va utiliser les modules que l'on a exporté
const membres = require("./routes/membres");
app.use("/membres", membres);
const users = require("./routes/users");
app.use("/users", users);
const login = require("./routes/login");
app.use("/login", login);
const concours = require("./routes/competition");
app.use("/competition", concours);

// Middleware pour les routes non trouvées (404)
app.use((req, res, next) => {
  res.status(404).json({ error: "Page not found." });
});

app.listen(port, () => {
  console.log("Server is online !");
});
