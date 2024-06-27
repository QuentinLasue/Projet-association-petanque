import { createContext, useState } from "react";

// création d'un context pour gérer l'état de connection
const AuthContext = createContext();

const AuthProvider= ({children})=>{
    const [loggedIn, setLoggedIn]= useState(false);

    // Configuration du headers pour inclure le token JWT
    const getHeaders = ()=>{
        let token = localStorage.getItem('accessToken');
     return {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
    }
        
    const isLogged = ()=>{
        let newToken = localStorage.getItem('accessToken');
        setLoggedIn(!!newToken);
        return !!newToken;
    };

    const logout = ()=>{
        localStorage.removeItem('accessToken');
        setLoggedIn(false);
    }
    return (
        <AuthContext.Provider value ={{isLogged, logout, loggedIn, getHeaders}}>
            {children}
        </AuthContext.Provider>
    )
}
export { AuthContext,AuthProvider };