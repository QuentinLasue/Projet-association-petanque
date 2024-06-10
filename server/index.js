// on appelle la librairy express
const express = require("express");
// choix du port
const port = 5000;

const app = express();

app.get("/", (request, response) => {
  response.send("Bienvenue sur notre API du club de pétanque !");
});

// On va utiliser les modules que l'on a exporté
const membres = require("./routes/membres");
app.use("/membres", membres);
const users = require("./routes/users");
app.use("/users", users);

app.listen(port, () => {
  console.log("Server is online !");
});
