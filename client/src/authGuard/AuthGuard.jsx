import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Auth/AuthContext";

function AuthGuard({children}){
    // On utilise le contexte afin de vérifier l'état de connexion
    const {isLoggedIn} = useContext(AuthContext);
    //ici logique de vérification si on est connecté
if(!isLoggedIn){
    return <Navigate to='/auth/connexion'/>
}
    return children 
}

export default AuthGuard;