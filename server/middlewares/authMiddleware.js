const jwt = require('jsonwebtoken');
//pour accéder au variable d'environement 
require('dotenv').config();


// Middleware pour vérifier le token JWT et protéger certaines routes
const verifyToken = (request, response, next)=>{
    const SECRET_KEY = process.env.SECRET_KEY;
    const authHeader = request.headers.authorization
    if (authHeader) {
        // Extrait le token du header Authorization (Bearer token)
        const token = authHeader.split(' ')[1];

        if (token) {
            try {
                // Vérifie et décrypte le token
                const decoded = jwt.verify(token, SECRET_KEY);
                request.user = decoded; // Ajoute les données utilisateur décryptées à l'objet de requête (req)
                next(); // Passe à l'étape suivante du middleware
            } catch (error) {
                return response.status(403).json({ error: 'Token invalide' });
            }
        } else {
            return response.status(401).json({ error: 'Token d\'authentification manquant' });
        }
    } else {
        return response.status(401).json({ error: 'En-tête d\'autorisation manquant' });
    }
}

module.exports = verifyToken;