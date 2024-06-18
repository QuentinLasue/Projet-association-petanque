import { createContext, useState } from "react";

// création d'un context pour gérer l'état de connection
const AuthContext = createContext();

const AuthProvider= ({children})=>{
    
    const [isLoggedIn, setIsLoggedIn]= useState(false);

    const login = ()=>{
        setIsLoggedIn(true);
        console.log("Vous êtes connecté");
        console.log(isLoggedIn);
    };
    const logout = ()=>{
        setIsLoggedIn(false);
        console.log("Vous êtes déconnecté");
        console.log(isLoggedIn);

    }
    return (
        <AuthContext.Provider value ={{isLoggedIn, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}
export { AuthContext,AuthProvider };